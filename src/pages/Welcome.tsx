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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-coffee-cream via-background to-coffee-light">
      <div className="flex-1 max-w-xl w-full mx-auto px-5 pt-10 pb-6 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-4">
            <Icon className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{content.title}</h1>
          <p className="text-base text-muted-foreground">{content.tagline}</p>
        </div>

        {/* Body */}
        <div className="flex-1">
          <p className="text-sm md:text-base text-foreground mb-5 text-center">{content.description}</p>
          <ul className="space-y-2.5 max-w-sm mx-auto">
            {content.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA pinned to bottom */}
        <div className="mt-10 pt-6 border-t border-border/50 space-y-3">
          <Link to="/auth" state={{ from, mode: "signup" }} className="block">
            <Button size="lg" className="w-full">Sign up free</Button>
          </Link>
          <Link to="/auth" state={{ from }} className="block">
            <Button size="lg" variant="outline" className="w-full">I already have an account</Button>
          </Link>
          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
