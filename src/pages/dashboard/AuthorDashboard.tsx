import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, FileEdit, PenLine, Send, Clock, FileText, CheckCircle2, BarChart3 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/use-toast";
import { listMyPosts, publishPostNow, type BlogPost } from "@/lib/blogData";

const fmt = (d?: string | null) => (d ? new Date(d).toLocaleString() : "—");

const AuthorDashboard = () => {
  const { user, profile } = useCurrentUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!user) return;
    listMyPosts(user.id).then(setPosts).catch(() => setPosts([]));
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const { drafts, scheduled, published } = useMemo(() => {
    const now = Date.now();
    return {
      drafts: posts.filter((p) => p.status === "draft"),
      scheduled: posts.filter(
        (p) => p.status === "published" && p.published_at && new Date(p.published_at).getTime() > now,
      ),
      published: posts.filter(
        (p) => p.status === "published" && (!p.published_at || new Date(p.published_at).getTime() <= now),
      ),
    };
  }, [posts]);

  const totalViews = useMemo(() => posts.reduce((a, p) => a + (p.views_count || 0), 0), [posts]);

  const onPublish = async (p: BlogPost) => {
    setBusy(p.id);
    try {
      await publishPostNow(p.id);
      toast({ title: "Published", description: `"${p.title}" is now live.` });
      load();
    } catch (e: any) {
      toast({ title: "Could not publish", description: e.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const PostRow = ({ p, showPublish }: { p: BlogPost; showPublish?: boolean }) => (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate font-semibold">{p.title}</p>
        <p className="text-xs text-muted-foreground">
          {p.category?.name ? `${p.category.name} · ` : ""}
          {p.status === "published" ? `Publish date ${fmt(p.published_at)}` : `Updated ${fmt(p.updated_at)}`}
          {" · "}{p.views_count} views
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status}</Badge>
        <Button size="sm" variant="ghost" asChild>
          <Link to={`/news/${p.slug}`}><Eye className="mr-1 h-4 w-4" /> Preview</Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/news/${p.id}/edit`}><FileEdit className="mr-1 h-4 w-4" /> Edit</Link>
        </Button>
        {showPublish && (
          <Button size="sm" disabled={busy === p.id} onClick={() => onPublish(p)}>
            <Send className="mr-1 h-4 w-4" /> Publish now
          </Button>
        )}
      </div>
    </div>
  );

  const List = ({ items, empty, showPublish }: { items: BlogPost[]; empty: string; showPublish?: boolean }) =>
    items.length === 0 ? (
      <p className="py-10 text-center text-sm text-muted-foreground">{empty}</p>
    ) : (
      <div>{items.map((p) => <PostRow key={p.id} p={p} showPublish={showPublish} />)}</div>
    );

  if (!user) return null;

  return (
    <DashboardLayout title={`Author hub – ${profile?.name || ""}`} subtitle="Draft, schedule and publish newsfeed items">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => navigate("/news/new")}><PenLine className="mr-2 h-4 w-4" /> New post</Button>
        <Button variant="outline" asChild><Link to="/news">View newsfeed</Link></Button>
        <Button variant="outline" asChild><Link to="/news/mine">All my posts</Link></Button>
      </div>

      <KpiRow
        items={[
          { label: "Drafts", value: drafts.length, icon: FileText },
          { label: "Scheduled", value: scheduled.length, icon: Clock },
          { label: "Published", value: published.length, icon: CheckCircle2, to: "/news" },
          { label: "Total views", value: totalViews, icon: BarChart3 },
        ]}
      />

      <Card>
        <CardHeader><CardTitle>Your newsfeed items</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="drafts">
            <TabsList>
              <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({scheduled.length})</TabsTrigger>
              <TabsTrigger value="published">Published ({published.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="drafts">
              <List items={drafts} empty="No drafts — start a new post." showPublish />
            </TabsContent>
            <TabsContent value="scheduled">
              <List items={scheduled} empty="Nothing scheduled. Set a future publish date on a post." showPublish />
            </TabsContent>
            <TabsContent value="published">
              <List items={published} empty="No published posts yet." />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AuthorDashboard;
