import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type Provider = "google" | "apple" | "facebook";

const DEMO_ACCOUNTS: Record<Provider, { email: string; password: string; name: string }> = {
  google: { email: "demo-google@coffeelovers.app", password: "DemoGoogle!2024", name: "Google Demo User" },
  apple: { email: "demo-apple@coffeelovers.app", password: "DemoApple!2024", name: "Apple Demo User" },
  facebook: { email: "demo-facebook@coffeelovers.app", password: "DemoFacebook!2024", name: "Facebook Demo User" },
};

const ProviderIcon = ({ provider }: { provider: Provider }) => {
  if (provider === "google") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z" />
      </svg>
    );
  }
  if (provider === "apple") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.4 12.7c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9s-2-.9-3.3-.9c-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3 0 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.5.7-1.1 1-2.2 1-2.2 0-.1-2.4-.9-2.4-3.6zM14 5.4c.7-.8 1.1-2 1-3.1-1 0-2.2.6-2.9 1.5-.6.7-1.2 1.9-1 3 1.1 0 2.3-.6 2.9-1.4z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z" />
    </svg>
  );
};

export const SocialLoginButtons = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Provider | null>(null);

  const handle = async (provider: Provider) => {
    setLoading(provider);
    const { email, password, name } = DEMO_ACCOUNTS[provider];
    try {
      let { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Demo account doesn't exist yet — create it.
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { name },
          },
        });
        if (signUpError) throw signUpError;
        // Try sign-in again in case email confirmation is disabled.
        await supabase.auth.signInWithPassword({ email, password });
      }
      toast({
        title: `Signed in with ${provider} (demo)`,
        description: "Real OAuth provider not yet configured — using a shared demo account.",
      });
      navigate("/");
    } catch (e: any) {
      toast({
        title: "Demo sign-in failed",
        description: e.message ?? "Try again or use email/password.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-2">
      {(Object.keys(DEMO_ACCOUNTS) as Provider[]).map((p) => (
        <Button
          key={p}
          type="button"
          variant="outline"
          className="w-full justify-center gap-2 capitalize"
          disabled={loading !== null}
          onClick={() => handle(p)}
        >
          <ProviderIcon provider={p} />
          {loading === p ? "Connecting…" : `Continue with ${p}`}
        </Button>
      ))}
      <p className="text-[10px] text-muted-foreground text-center">
        Social sign-in is in demo mode — uses a shared test account.
      </p>
    </div>
  );
};
