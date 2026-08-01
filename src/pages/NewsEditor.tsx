import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/blog/RichTextEditor";
import PostBanner from "@/components/blog/PostBanner";
import {
  createPost,
  deletePost,
  getPostById,
  listCategories,
  slugify,
  updatePost,
  type BlogCategory,
  type BlogPost,
} from "@/lib/blogData";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const NewsEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, roles, loading: userLoading } = useCurrentUser();
  const canWrite = (roles as string[]).includes("author") || (roles as string[]).includes("admin");

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [existing, setExisting] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [banner, setBanner] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    getPostById(id).then((p) => {
      if (!p) return;
      setExisting(p);
      setTitle(p.title);
      setSlug(p.slug);
      setExcerpt(p.excerpt ?? "");
      setBanner(p.banner_url ?? "");
      setCategoryId(p.category_id ?? "");
      setStatus(p.status);
      setContent(p.content);
    });
  }, [id]);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSave = async () => {
    if (!user) return;
    if (!title.trim()) return toast.error("Give the post a title");
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: (slug.trim() || slugify(title)) as string,
        excerpt: excerpt.trim() || null,
        content,
        banner_url: banner.trim() || null,
        category_id: categoryId || null,
        status,
      };
      const saved = existing
        ? await updatePost(existing.id, payload, existing.published_at)
        : await createPost(payload, user.id);
      toast.success(status === "published" ? "Post published" : "Draft saved");
      navigate(status === "published" ? `/news/${saved.slug}` : "/news/mine");
    } catch (e: any) {
      toast.error(e.message ?? "Could not save the post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existing) return;
    try {
      await deletePost(existing.id);
      toast.success("Post deleted");
      navigate("/news/mine");
    } catch (e: any) {
      toast.error(e.message ?? "Could not delete the post");
    }
  };

  if (userLoading) return <div className="min-h-screen pt-24 text-center text-muted-foreground">Loading…</div>;
  if (!canWrite) {
    return (
      <div className="min-h-screen pt-24 text-center space-y-4">
        <p className="text-muted-foreground">You need author access to write news posts.</p>
        <Button asChild variant="outline">
          <Link to="/news">Back to news</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-28 md:pb-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/news">
              <ArrowLeft className="w-4 h-4 mr-2" /> News
            </Link>
          </Button>
          <div className="flex gap-2">
            {existing && (
              <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" /> {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">{existing ? "Edit post" : "New post"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!existing) setSlug(slugify(e.target.value));
                  }}
                  placeholder="How we cup a new harvest"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="banner">Banner image URL</Label>
              <Input
                id="banner"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                placeholder="https://…"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Banner preview</Label>
              <PostBanner
                imageUrl={banner || selectedCategory?.banner_url}
                overlayColor={selectedCategory?.overlay_color}
                overlayOpacity={selectedCategory?.overlay_opacity}
                eyebrow={selectedCategory?.name}
                title={title || "Post title"}
                height="h-44"
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsEditor;
