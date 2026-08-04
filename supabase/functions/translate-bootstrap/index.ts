import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

async function translateBatch(
  apiKey: string,
  targetName: string,
  items: { key: string; text: string }[],
): Promise<Record<string, string>> {
  const payload = Object.fromEntries(items.map((i) => [i.key, i.text]));
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            `You are a professional localisation engine for a specialty-coffee web platform called CoffeePlanets. ` +
            `Translate every value of the given JSON object from English into ${targetName}. ` +
            `Keep the JSON keys exactly as-is; keep the brand name "CoffeePlanets" untranslated; ` +
            `preserve placeholders like {name} and any HTML tags; keep UI labels short and idiomatic; reply with JSON only.`,
        },
        { role: "user", content: JSON.stringify(payload) },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(content) as Record<string, string>;
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    return m ? (JSON.parse(m[0]) as Record<string, string>) : {};
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const token = Deno.env.get("TRANSLATE_BOOTSTRAP_TOKEN");
  if (!token || req.headers.get("x-bootstrap-token") !== token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("LOVABLE_API_KEY")!;
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const body = await req.json().catch(() => ({}));
  const only: string[] | null = Array.isArray(body.locales) ? body.locales : null;

  const { data: langs } = await admin
    .from("languages")
    .select("code, name")
    .eq("enabled", true)
    .neq("code", "en");
  const { data: strings } = await admin.from("ui_strings").select("key, en_value");
  const all = (strings ?? []).map((s: { key: string; en_value: string }) => ({ key: s.key, text: s.en_value }));

  const report: Record<string, number | string> = {};
  for (const lang of (langs ?? []) as { code: string; name: string }[]) {
    if (only && !only.includes(lang.code)) continue;
    const { data: existing } = await admin
      .from("ui_translations")
      .select("string_key")
      .eq("locale", lang.code);
    const have = new Set((existing ?? []).map((r: { string_key: string }) => r.string_key));
    const pending = all.filter((s) => !have.has(s.key));
    if (!pending.length) {
      report[lang.code] = 0;
      continue;
    }
    let count = 0;
    try {
      for (let i = 0; i < pending.length; i += 40) {
        const slice = pending.slice(i, i + 40);
        const result = await translateBatch(apiKey, lang.name, slice);
        const rows = slice
          .filter((s) => typeof result[s.key] === "string" && result[s.key].trim())
          .map((s) => ({ string_key: s.key, locale: lang.code, value: result[s.key].trim(), is_machine: true }));
        if (rows.length) {
          await admin.from("ui_translations").upsert(rows, { onConflict: "string_key,locale" });
          count += rows.length;
        }
      }
      report[lang.code] = count;
    } catch (e) {
      report[lang.code] = `error: ${(e as Error).message.slice(0, 120)}`;
    }
  }

  return new Response(JSON.stringify(report), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
