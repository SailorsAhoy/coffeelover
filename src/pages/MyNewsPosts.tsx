import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listMyPosts, type BlogPost } from "@/lib/blogData";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const MyNewsPosts = () => {
  const { user, roles } = useCurrentUser();
  const canWrite = (roles as string[]).includes("author") || (roles as string[]).includes("admin");
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!user) return;
    listMyPosts(user.id).then(setPosts).catch(() => setPosts([]));
  }, [user]);

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-28 md:pb-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">My posts</h1>
          {canWrite && (
            <Button asChild size="sm">
              <Link to="/news/new">
                <PenLine className="w-4 h-4 mr-2" /> New post
              </Link>
            </Button>
          )}
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              You haven't written any posts yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <Card key={p.id}>
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{p.title}</p>
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNewsPosts;
