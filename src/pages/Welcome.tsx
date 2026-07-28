import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { getWelcomeContent } from "@/lib/welcomeContent";

const Welcome = () => {
  const { slug } = useParams<{ slug: string }>();
  const content = getWelcomeContent(slug);
  const Icon = content.icon;
  const from = `/${content.slug}`;

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
