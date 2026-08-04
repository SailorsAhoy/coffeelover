/**
 * Landing-page (welcome) copy as translatable UI strings.
 *
 * Every text field of WELCOME_CONTENT is flattened into a stable key
 * `welcome.<slug>.<path>` so it can be edited and auto-translated from
 * Settings → Languages & Translations, exactly like the rest of the UI.
 */
import { WELCOME_CONTENT, getWelcomeContent, type WelcomeContent } from "@/lib/welcomeContent";

export interface WelcomeStringDef {
  key: string;
  namespace: string;
  en: string;
}

/** All landing slugs that have dedicated copy, plus the generic fallback. */
export const WELCOME_SLUGS = [...Object.keys(WELCOME_CONTENT), "app"];

function flattenOne(content: WelcomeContent): WelcomeStringDef[] {
  const s = content.slug;
  const out: WelcomeStringDef[] = [];
  const push = (path: string, en: string | undefined | null) => {
    if (en) out.push({ key: `welcome.${s}.${path}`, namespace: "welcome", en });
  };

  push("title", content.title);
  push("tagline", content.tagline);
  push("description", content.description);
  content.bullets.forEach((b, i) => push(`bullet.${i}`, b));

  const ex = content.example;
  push("ex.kicker", ex.kicker);
  push("ex.name", ex.name);
  push("ex.meta", ex.meta);
  push("ex.description", ex.description);
  push("ex.about", ex.about);
  push("ex.highlight", ex.highlight);
  ex.tags.forEach((t, i) => push(`ex.tag.${i}`, t));
  ex.details.forEach((d, i) => {
    push(`ex.detail.${i}.label`, d.label);
    push(`ex.detail.${i}.value`, d.value);
  });
  push("ex.section.title", ex.section.title);
  ex.section.items.forEach((it, i) => push(`ex.section.item.${i}`, it));
  push("ex.review.author", ex.review.author);
  push("ex.review.text", ex.review.text);

  return out;
}

/** Every landing-page string, ready to sync into `ui_strings`. */
export const WELCOME_STRINGS: WelcomeStringDef[] = WELCOME_SLUGS.flatMap((slug) =>
  flattenOne(getWelcomeContent(slug === "app" ? undefined : slug)),
);

export const WELCOME_MAP: Record<string, string> = Object.fromEntries(
  WELCOME_STRINGS.map((s) => [s.key, s.en]),
);

type T = (key: string, fallback?: string) => string;

/** Returns the landing content with every text field passed through `t()`. */
export function translateWelcomeContent(slug: string | undefined, t: T): WelcomeContent {
  const base = getWelcomeContent(slug);
  const s = base.slug;
  const k = (path: string, fallback: string) => t(`welcome.${s}.${path}`, fallback);
  const ex = base.example;

  return {
    ...base,
    title: k("title", base.title),
    tagline: k("tagline", base.tagline),
    description: k("description", base.description),
    bullets: base.bullets.map((b, i) => k(`bullet.${i}`, b)),
    example: {
      ...ex,
      kicker: k("ex.kicker", ex.kicker),
      name: k("ex.name", ex.name),
      meta: k("ex.meta", ex.meta),
      description: k("ex.description", ex.description),
      about: k("ex.about", ex.about),
      highlight: ex.highlight ? k("ex.highlight", ex.highlight) : ex.highlight,
      tags: ex.tags.map((tag, i) => k(`ex.tag.${i}`, tag)),
      details: ex.details.map((d, i) => ({
        label: k(`ex.detail.${i}.label`, d.label),
        value: k(`ex.detail.${i}.value`, d.value),
      })),
      section: {
        title: k("ex.section.title", ex.section.title),
        items: ex.section.items.map((it, i) => k(`ex.section.item.${i}`, it)),
      },
      review: {
        ...ex.review,
        author: k("ex.review.author", ex.review.author),
        text: k("ex.review.text", ex.review.text),
      },
    },
  };
}
