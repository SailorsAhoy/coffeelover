import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Star, Lock, ArrowRight } from "lucide-react";
import { translateWelcomeContent } from "@/lib/i18n/welcomeStrings";
import { useT } from "@/contexts/I18nContext";

const Welcome = () => {
  const { slug } = useParams<{ slug: string }>();
  const t = useT();
  const content = translateWelcomeContent(slug, t);
  const Icon = content.icon;
  const from = `/${content.slug}`;
  const ex = content.example;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-coffee-cream via-background to-coffee-light">
      {/* Scrollable content — reserves space for the sticky CTA so it never overlaps */}
      <div className="max-w-xl w-full mx-auto px-5 pt-8 sm:pt-12 pb-[calc(env(safe-area-inset-bottom,0px)+15rem)] sm:pb-40">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-4">
            <Icon className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{content.title}</h1>
          <p className="text-base text-muted-foreground">{content.tagline}</p>
        </div>

        {/* Body */}
        <p className="text-sm sm:text-base text-foreground mb-5 text-center">{content.description}</p>
        <ul className="space-y-2.5 max-w-sm mx-auto">
          {content.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
              <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Full example listing */}
        <div className="mt-9">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 text-center">
            {ex.kicker}
          </p>

          <Card className="overflow-hidden">
            {/* Banner */}
            {ex.banner ? (
              <div className="relative h-32 w-full overflow-hidden sm:h-40">
                <img
                  src={ex.banner}
                  alt={`${ex.name} banner`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/25" />
              </div>
            ) : (
              <div className="h-24 bg-gradient-to-r from-primary/80 via-primary/50 to-secondary" />
            )}

            <CardContent className="p-5">
              {/* Avatar + title, starting 6px under the image */}
              <div className="flex items-center gap-3" style={{ marginTop: 6 }}>
                {ex.avatar ? (
                  <img
                    src={ex.avatar}
                    alt={ex.name}
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-2xl border border-border object-cover shadow-sm"
                  />
                ) : (
                  <div className="p-3 rounded-2xl bg-card border border-border shadow-sm shrink-0">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-foreground leading-tight truncate">{ex.name}</h2>
                  <p className="text-xs text-muted-foreground">{ex.meta}</p>
                </div>
              </div>


              {ex.highlight && (
                <p className="text-base font-semibold text-primary mt-4">{ex.highlight}</p>
              )}

              <div className="flex flex-wrap gap-1.5 mt-3">
                {ex.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[11px] font-normal">{t}</Badge>
                ))}
              </div>

              <Separator className="my-4" />

              {/* About */}
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{t("welcome.about", "About")}</h3>
              <p className="text-sm text-foreground/80">{ex.about}</p>


              {/* Details */}
              <Separator className="my-4" />
              <h3 className="text-sm font-semibold text-foreground mb-2">{t("welcome.details", "Details")}</h3>
              <dl className="space-y-1.5">
                {ex.details.map((d) => (
                  <div key={d.label} className="flex gap-3 text-sm">
                    <dt className="w-32 shrink-0 text-muted-foreground">{d.label}</dt>
                    <dd className="text-foreground/90">{d.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Section */}
              <Separator className="my-4" />
              <h3 className="text-sm font-semibold text-foreground mb-2">{ex.section.title}</h3>
              <ul className="space-y-1.5">
                {ex.section.items.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>

              {/* Review */}
              <Separator className="my-4" />
              <h3 className="text-sm font-semibold text-foreground mb-2">{t("welcome.reviews", "Reviews")}</h3>
              <div className="rounded-lg bg-muted/60 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{ex.review.author}</span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: ex.review.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{ex.review.text}</p>
              </div>

              {/* Locked teaser */}
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Contact details, photos and the full directory unlock when you sign in.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Big CTA right under the example */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-xl">
          <div className="rounded-[calc(1rem-2px)] bg-card px-5 py-6 text-center">
            <h3 className="text-xl font-bold text-foreground">
              This is just one of hundreds
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 mb-5">
              Create a free account to browse every {content.title.toLowerCase()} listing, save favorites and message directly.
            </p>
            <Link to="/auth" state={{ from, mode: "signup" }} className="block">
              <Button size="lg" className="w-full text-base font-semibold h-12 shadow-lg hover:shadow-xl transition-shadow">
                Sign up free
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">
              Free forever · No credit card ·{" "}
              <Link to="/auth" state={{ from }} className="underline hover:text-foreground">
                I already have an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA — anchored to bottom on every viewport, with safe-area padding */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/85 backdrop-blur-md"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="max-w-xl mx-auto px-5 py-3 sm:py-4 space-y-2">
          <Link to="/auth" state={{ from, mode: "signup" }} className="block">
            <Button size="lg" className="w-full">Sign up free</Button>
          </Link>
          <div className="flex items-center justify-between gap-3 text-xs">
            <Link
              to="/auth"
              state={{ from }}
              className="text-muted-foreground hover:text-foreground underline"
            >
              I already have an account
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground underline">
              ← Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
