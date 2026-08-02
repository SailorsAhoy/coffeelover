import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, PenLine, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { listPosts, type BlogPost } from "@/lib/blogData";

type Author = { id: string; name: string | null };

const AuthorManagement = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAuthors = async () => {
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "author");
    const ids = (roleRows ?? []).map((r) => r.user_id);
    if (ids.length === 0) {
      setAuthors([]);
      return;
    }
    const { data: profiles } = await (supabase as any)
      .from("profiles_public")
      .select("id, name")
      .in("id", ids);
    setAuthors(
      ids.map((id) => ({
        id,
        name: (profiles ?? []).find((p: any) => p.id === id)?.name ?? null,
      })),
    );
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadAuthors(), listPosts().then(setPosts).catch(() => setPosts([]))]).finally(() =>
      setLoading(false),
    );
  }, []);

  const grant = async () => {
    const q = query.trim();
    if (!q) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.rpc("lookup_profile", { _q: q });
      if (error) throw error;
      const found = (data as Author[] | null)?.[0];
      if (!found) {
        toast({ title: "No user found", description: "Check the email or user ID.", variant: "destructive" });
        return;
      }
      const { error: insErr } = await supabase
        .from("user_roles")
        .insert({ user_id: found.id, role: "author" });
      if (insErr && !insErr.message.includes("duplicate")) throw insErr;
      toast({ title: "Author added", description: found.name ?? found.id });
      setQuery("");
      await loadAuthors();
    } catch (e: any) {
      toast({ title: "Could not grant author role", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", id).eq("role", "author");
    if (error) {
      toast({ title: "Could not remove author", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Author role removed" });
    await loadAuthors();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Authors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="User email or ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && grant()}
            />
            <Button onClick={grant} disabled={busy}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Grant author"}
            </Button>
          </div>

          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : authors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No authors yet.</p>
          ) : (
            <div className="space-y-2">
              {authors.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{a.name ?? "Unnamed user"}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.id}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => revoke(a.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All news posts</span>
            <Button asChild size="sm">
              <Link to="/news/new">
                <PenLine className="w-4 h-4 mr-2" /> New post
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            posts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(p.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status}</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/news/${p.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthorManagement;
