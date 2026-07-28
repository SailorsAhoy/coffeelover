import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { getWelcomeContent } from "@/lib/welcomeContent";

const Welcome = () => {
  const { slug } = useParams<{ slug: string }>();
  const content = getWelcomeContent(slug);
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-cream via-background to-coffee-light">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 pb-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-full mb-6">
            <Icon className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{content.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground">{content.tagline}</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6 space-y-4">
            <p className="text-base text-foreground">{content.description}</p>
            <ul className="space-y-2">
              {content.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/auth" state={{ from: `/${content.slug}` }}>
            <Button size="lg" className="w-full sm:w-auto">Sign in to continue</Button>
          </Link>
          <Link to="/auth" state={{ from: `/${content.slug}`, mode: "signup" }}>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">Create an account</Button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
