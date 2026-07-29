import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Coffee } from "lucide-react";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

type SignupIntent = "user" | "pro_user" | "company" | "teacher";

const isSafeInternalPath = (p: unknown): p is string =>
  typeof p === "string" && p.startsWith("/") && !p.startsWith("//");

const Auth = () => {
  const location = useLocation();
  const state = (location.state ?? {}) as { from?: string; mode?: "login" | "signup" };
  const redirectTo = isSafeInternalPath(state.from) ? state.from : "/";
  const [tab, setTab] = useState<"login" | "signup">(state.mode === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [intent, setIntent] = useState<SignupIntent>("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate(redirectTo, { replace: true });
    });
  }, [navigate, redirectTo]);

  const assignExtraRole = async (userId: string, role: SignupIntent) => {
    if (role === "user") return;
    // 'user' role is auto-assigned by trigger; insert extra one for chosen intent.
    await (supabase as any).from("user_roles").insert({ user_id: userId, role });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Welcome back!" });
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      toast({ title: "Sign in failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
          data: { name },
        },
      });
      if (error) throw error;
      if (data.user) {
        // Give RLS a moment to see the trigger-created row before adding extra role
        setTimeout(() => assignExtraRole(data.user!.id, intent), 500);
      }
      // If session is returned immediately (auto-confirm), route to intended page.
      if (data.session) {
        toast({ title: "Welcome!" });
        navigate(redirectTo, { replace: true });
        return;
      }
      toast({ title: "Account created", description: "Check your email to confirm, then sign in." });
      setTab("login");
    } catch (err: any) {
      toast({ title: "Sign up failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-cream to-coffee-light p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Coffee className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">CoffeeLovers</CardTitle>
          <CardDescription>Your specialty coffee community</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Loading..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input id="signup-name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>I'm joining as a...</Label>
                  <RadioGroup value={intent} onValueChange={(v) => setIntent(v as SignupIntent)} className="grid grid-cols-2 gap-2">
                    {[
                      { v: "user", label: "Coffee lover" },
                      { v: "pro_user", label: "Professional" },
                      { v: "company", label: "Company" },
                      { v: "teacher", label: "Teacher" },
                    ].map((o) => (
                      <Label
                        key={o.v}
                        htmlFor={`intent-${o.v}`}
                        className="flex items-center gap-2 border border-input rounded-md p-2 cursor-pointer hover:bg-accent"
                      >
                        <RadioGroupItem id={`intent-${o.v}`} value={o.v} />
                        <span className="text-sm">{o.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                <Label
                  htmlFor="signup-no-promo"
                  className="flex items-start gap-2 border border-input rounded-md p-3 cursor-pointer hover:bg-accent"
                >
                  <Checkbox
                    id="signup-no-promo"
                    checked={noPromo}
                    onCheckedChange={(v) => setNoPromo(v === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm font-normal leading-snug">
                    I do not want to receive promotional emails of any kind
                  </span>
                </Label>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Loading..." : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <SocialLoginButtons redirectTo={redirectTo} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
