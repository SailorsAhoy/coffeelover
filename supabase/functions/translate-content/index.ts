import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

interface Item { key: string; text: string }

async function translateBatch(
  apiKey: string,
  targetName: string,
  items: Item[],
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
            `Rules: keep the JSON keys exactly as-is; keep the brand name "CoffeePlanets" untranslated; ` +
            `preserve placeholders like {name} and any HTML tags; keep UI labels short and idiomatic; ` +
            `reply with JSON only.`,
        },
        { role: "user", content: JSON.stringify(payload) },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Response(body, { status: res.status });
  }
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

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const anon = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await anon.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const locale: string = body.locale;
    const scope: string = body.scope ?? "ui";
    const overwrite: boolean = body.overwrite === true;
    if (!locale || typeof locale !== "string" || locale.length > 10) {
      return new Response(JSON.stringify({ error: "Invalid locale" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (locale === "en") {
      return new Response(JSON.stringify({ translated: 0, message: "English is the source language" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: lang } = await admin
      .from("languages")
      .select("code, name")
      .eq("code", locale)
      .maybeSingle();
    if (!lang) {
      return new Response(JSON.stringify({ error: "Unknown language" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build the list of pending items
    let pending: Item[] = [];
    let contentMeta: Record<string, { table: string; row: string; column: string }> = {};

    if (scope === "ui") {
      const { data: strings } = await admin.from("ui_strings").select("key, en_value");
      const { data: existing } = await admin
        .from("ui_translations")
        .select("string_key")
        .eq("locale", locale);
      const have = new Set((existing ?? []).map((r: { string_key: string }) => r.string_key));
      pending = (strings ?? [])
        .filter((s: { key: string }) => overwrite || !have.has(s.key))
        .map((s: { key: string; en_value: string }) => ({ key: s.key, text: s.en_value }));
    } else {
      const rows: { table: string; row_id: string; column: string; value: string }[] =
        Array.isArray(body.items) ? body.items : [];
      const { data: existing } = await admin
        .from("content_translations")
        .select("table_name, row_id, column_name")
        .eq("locale", locale);
      const have = new Set(
        (existing ?? []).map(
          (r: { table_name: string; row_id: string; column_name: string }) =>
            `${r.table_name}:${r.row_id}:${r.column_name}`,
        ),
      );
      rows.forEach((r, idx) => {
        const id = `${r.table}:${r.row_id}:${r.column}`;
        if (!r.value || (!overwrite && have.has(id))) return;
        const k = `i${idx}`;
        contentMeta[k] = { table: r.table, row: r.row_id, column: r.column };
        pending.push({ key: k, text: r.value });
      });
    }

    if (pending.length === 0) {
      return new Response(JSON.stringify({ translated: 0, message: "Nothing to translate" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let translated = 0;
    const BATCH = 40;
    for (let i = 0; i < pending.length; i += BATCH) {
      const slice = pending.slice(i, i + BATCH);
      let result: Record<string, string>;
      try {
        result = await translateBatch(apiKey, lang.name, slice);
      } catch (e) {
        if (e instanceof Response) {
          const status = e.status;
          const text = await e.text();
          return new Response(
            JSON.stringify({
              error:
                status === 429
                  ? "AI rate limit reached — please retry in a moment."
                  : status === 402
                    ? "AI credits exhausted — add credits in your workspace settings."
                    : `AI gateway error: ${text}`,
              translated,
            }),
            { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        throw e;
      }

      if (scope === "ui") {
        const rows = slice
          .filter((s) => typeof result[s.key] === "string" && result[s.key].trim())
          .map((s) => ({ string_key: s.key, locale, value: result[s.key].trim(), is_machine: true }));
        if (rows.length) {
          await admin.from("ui_translations").upsert(rows, { onConflict: "string_key,locale" });
          translated += rows.length;
        }
      } else {
        const rows = slice
          .filter((s) => typeof result[s.key] === "string" && result[s.key].trim())
          .map((s) => ({
            table_name: contentMeta[s.key].table,
            row_id: contentMeta[s.key].row,
            column_name: contentMeta[s.key].column,
            locale,
            value: result[s.key].trim(),
            is_machine: true,
          }));
        if (rows.length) {
          await admin
            .from("content_translations")
            .upsert(rows, { onConflict: "table_name,row_id,column_name,locale" });
          translated += rows.length;
        }
      }
    }

    return new Response(JSON.stringify({ translated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
