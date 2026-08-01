import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const SITE = "https://coffeelover.lovable.app";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, published_at, created_at, category:blog_categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("news-rss query failed:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const items = (data ?? [])
    .map((p: any) => {
      const date = new Date(p.published_at ?? p.created_at).toUTCString();
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE}/news/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/news/${p.slug}</guid>
      <pubDate>${date}</pubDate>
      ${p.category?.name ? `<category>${escape(p.category.name)}</category>` : ""}
      <description>${escape(p.excerpt ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CoffeePlanets News</title>
    <link>${SITE}/news</link>
    <description>News, brewing craft and origin stories from the CoffeePlanets community.</description>
    <language>en</language>
    <atom:link href="${SITE}/news/rss" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
