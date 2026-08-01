import { supabase } from "@/integrations/supabase/client";

export type BlogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  banner_url: string | null;
  overlay_color: string;
  overlay_opacity: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  banner_url: string | null;
  category_id: string | null;
  author_id: string;
  status: "draft" | "published";
  published_at: string | null;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: BlogCategory | null;
  author_name?: string | null;
  author_avatar?: string | null;
};

const SELECT = "*, category:blog_categories(*)";

export function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function attachAuthors(posts: BlogPost[]): Promise<BlogPost[]> {
  const ids = [...new Set(posts.map((p) => p.author_id))];
  if (!ids.length) return posts;
  const { data } = await supabase.from("profiles_public").select("id, name, avatar_url").in("id", ids);
  const map = new Map((data ?? []).map((p: any) => [p.id, p]));
  return posts.map((p) => ({
    ...p,
    author_name: map.get(p.author_id)?.name ?? null,
    author_avatar: map.get(p.author_id)?.avatar_url ?? null,
  }));
}

export async function listCategories(): Promise<BlogCategory[]> {
  const { data, error } = await supabase.from("blog_categories").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as BlogCategory[];
}

export async function listPosts(opts: { categorySlug?: string; search?: string } = {}): Promise<BlogPost[]> {
  let q = supabase
    .from("blog_posts")
    .select(SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (opts.search) q = q.ilike("title", `%${opts.search}%`);
  const { data, error } = await q;
  if (error) throw error;
  let posts = (data ?? []) as unknown as BlogPost[];
  if (opts.categorySlug) posts = posts.filter((p) => p.category?.slug === opts.categorySlug);
  return attachAuthors(posts);
}

export async function listMyPosts(userId: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT)
    .eq("author_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog_posts").select(SELECT).eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [post] = await attachAuthors([data as unknown as BlogPost]);
  return post;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog_posts").select(SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as unknown as BlogPost) ?? null;
}

export type PostInput = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  banner_url?: string | null;
  category_id?: string | null;
  status: "draft" | "published";
};

export async function createPost(input: PostInput, authorId: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      ...input,
      author_id: authorId,
      published_at: input.status === "published" ? new Date().toISOString() : null,
    })
    .select("id, slug")
    .single();
  if (error) throw error;
  return data;
}

export async function updatePost(id: string, input: PostInput, currentPublishedAt: string | null) {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      ...input,
      published_at:
        input.status === "published" ? currentPublishedAt ?? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select("id, slug")
    .single();
  if (error) throw error;
  return data;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function incrementPostViews(id: string) {
  await supabase.rpc("increment_post_views" as any, { _post_id: id });
}
