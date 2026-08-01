import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Eye, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PostBanner from "@/components/blog/PostBanner";
import { getPostBySlug, incrementPostViews, type BlogPost } from "@/lib/blogData";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

const NewsPost = () => {
  const { slug } = useParams();
  const { user, roles } = useCurrentUser();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPostBySlug(slug)
      .then((p) => {
        setPost(p);
        if (p) incrementPostViews(p.id);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const canEdit = post && user && (post.author_id === user.id || (roles as string[]).includes("admin"));

  if (loading) {
    return <div className="min-h-screen pt-24 text-center text-muted-foreground">Loading…</div>;
  }
  if (!post) {
    return (
      <div className="min-h-screen pt-24 text-center space-y-4">
        <p className="text-muted-foreground">Post not found.</p>
        <Button asChild variant="outline">
          <Link to="/news">Back to news</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-28 md:pb-12 px-4 md:px-6">
      <Helmet>
        <title>{`${post.title} — CoffeePlanets News`}</title>
        <meta name="description" content={post.excerpt ?? post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt ?? post.title} />
        <meta property="og:type" content="article" />
        {post.banner_url && <meta property="og:image" content={post.banner_url} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt ?? undefined,
            image: post.banner_url ?? undefined,
            datePublished: post.published_at ?? post.created_at,
            dateModified: post.updated_at,
            author: { "@type": "Person", name: post.author_name ?? "CoffeePlanets" },
            publisher: { "@type": "Organization", name: "CoffeePlanets" },
          })}
        </script>
      </Helmet>

      <article className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/news">
              <ArrowLeft className="w-4 h-4 mr-2" /> News
            </Link>
          </Button>
          {canEdit && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/news/${post.id}/edit`}>
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </Link>
            </Button>
          )}
        </div>

        <PostBanner
          imageUrl={post.banner_url || post.category?.banner_url}
          overlayColor={post.category?.overlay_color}
          overlayOpacity={post.category?.overlay_opacity}
          eyebrow={post.category?.name}
          title={post.title}
          height="h-64 md:h-96"
        />

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Avatar className="h-9 w-9">
            <AvatarImage src={post.author_avatar ?? ""} />
            <AvatarFallback>{(post.author_name ?? "CP").slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{post.author_name ?? "CoffeePlanets"}</span>
          <span>·</span>
          <span>{formatDate(post.published_at ?? post.created_at)}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {post.views_count}
          </span>
        </div>

        {post.excerpt && <p className="text-lg text-muted-foreground">{post.excerpt}</p>}

        <div
          className="prose-post max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
};

export default NewsPost;
