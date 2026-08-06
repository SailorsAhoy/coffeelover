import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Rss, PenLine, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostBanner from "@/components/blog/PostBanner";
import { listCategories, listPosts, listTags, type BlogCategory, type BlogPost } from "@/lib/blogData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/contexts/I18nContext";


const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";

const News = () => {
  const { user, roles } = useCurrentUser();
  const { t, tc, loadContent } = useI18n();
  const canWrite = (roles as string[]).includes("author") || (roles as string[]).includes("admin");
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [active, setActive] = useState<string | undefined>();
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<{ category?: string; tags: string[]; search: string }>({
    tags: [],
    search: "",
  });

  useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]));
    listTags().then(setTags).catch(() => setTags([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    listPosts({
      categorySlug: active,
      search: search.trim() || undefined,
      tags: activeTags.length ? activeTags : undefined,
    })
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [active, search, activeTags]);


  useEffect(() => {
    void loadContent("blog_posts");
    void loadContent("blog_categories");
  }, [loadContent]);

  const [featured, ...rest] = posts;

  const rssUrl = useMemo(() => {
    const url = (supabase as any).supabaseUrl ?? "";
    return `${url}/functions/v1/news-rss`;
  }, []);

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-28 md:pb-12 px-4 md:px-6">
      <Helmet>
        <title>CoffeePlanets News — Specialty Coffee Stories</title>
        <meta
          name="description"
          content="News, brewing guides and origin stories from the CoffeePlanets specialty coffee community."
        />
        <link rel="alternate" type="application/rss+xml" title="CoffeePlanets News" href={rssUrl} />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{t("nav.news", "News")}</h1>
            <p className="text-muted-foreground mt-1">Stories, brewing craft and industry moves.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={rssUrl} target="_blank" rel="noreferrer">
                <Rss className="w-4 h-4 mr-2" /> RSS
              </a>
            </Button>
            {canWrite && (
              <Button size="sm" asChild>
                <Link to="/news/new">
                  <PenLine className="w-4 h-4 mr-2" /> New post
                </Link>
              </Button>
            )}
            {user && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/news/mine">My posts</Link>
              </Button>
            )}
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o);
              if (o) setDraft({ category: active, tags: activeTags, search });
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                {t("common.filters", "Filters")}
                {activeFilterCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 text-xs font-medium text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle className="font-display">{t("news.filter.title", "Filter the newsfeed")}</DialogTitle>
              </DialogHeader>

              <div className="space-y-5 py-2">
                <div className="space-y-2">
                  <Label>{t("common.search", "Search")}</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={draft.search}
                      onChange={(e) => setDraft((d) => ({ ...d, search: e.target.value }))}
                      placeholder={t("news.filter.searchPlaceholder", "Title or excerpt…")}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("news.filter.categories", "Categories")}</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={draft.category ? "outline" : "default"}
                      size="sm"
                      onClick={() => setDraft((d) => ({ ...d, category: undefined }))}
                    >
                      {t("common.all", "All")}
                    </Button>
                    {categories.map((c) => (
                      <Button
                        key={c.id}
                        type="button"
                        variant={draft.category === c.slug ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setDraft((d) => ({ ...d, category: d.category === c.slug ? undefined : c.slug }))
                        }
                      >
                        {tc("blog_categories", c.id, "name", c.name)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("news.filter.tags", "Tags")}</Label>
                  {tags.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("news.filter.noTags", "No tags yet.")}</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {tags.map((tag) => (
                        <label key={tag} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                          <Checkbox
                            checked={draft.tags.includes(tag)}
                            onCheckedChange={(c) =>
                              setDraft((d) => ({
                                ...d,
                                tags: c ? [...d.tags, tag] : d.tags.filter((x) => x !== tag),
                              }))
                            }
                          />
                          <span className="truncate">{tag}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDraft({ category: undefined, tags: [], search: "" })}
                >
                  {t("common.reset", "Reset")}
                </Button>
                <Button
                  onClick={() => {
                    setActive(draft.category);
                    setActiveTags(draft.tags);
                    setSearch(draft.search);
                    setOpen(false);
                  }}
                >
                  {t("common.apply", "Apply filters")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {activeCategory && (
            <Badge variant="secondary" className="gap-1">
              {tc("blog_categories", activeCategory.id, "name", activeCategory.name)}
              <button onClick={() => setActive(undefined)} aria-label="Clear category">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {activeTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button onClick={() => setActiveTags((v) => v.filter((x) => x !== tag))} aria-label="Clear tag">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {search.trim() && (
            <Badge variant="secondary" className="gap-1">
              “{search.trim()}”
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActive(undefined);
                setActiveTags([]);
                setSearch("");
              }}
            >
              {t("common.clearAll", "Clear all")}
            </Button>
          )}
        </div>


        {loading ? (
          <p className="text-muted-foreground py-12 text-center">Loading posts…</p>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No posts published yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Link to={`/news/${featured.slug}`} className="block group">
              <PostBanner
                imageUrl={featured.banner_url || featured.category?.banner_url}
                overlayColor={featured.category?.overlay_color}
                overlayOpacity={featured.category?.overlay_opacity}
                eyebrow={featured.category ? tc("blog_categories", featured.category.id, "name", featured.category.name) : null}
                title={tc("blog_posts", featured.id, "title", featured.title)}
                height="h-64 md:h-96"
                meta={
                  <>
                    {featured.author_name ?? "CoffeePlanets"} · {formatDate(featured.published_at)}
                  </>
                }
              />
              {featured.excerpt && (
                <p className="mt-3 text-muted-foreground group-hover:text-foreground transition-colors">
                  {tc("blog_posts", featured.id, "excerpt", featured.excerpt)}
                </p>
              )}
            </Link>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <Link key={p.id} to={`/news/${p.slug}`}>
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                    <PostBanner
                      imageUrl={p.banner_url || p.category?.banner_url}
                      overlayColor={p.category?.overlay_color}
                      overlayOpacity={p.category?.overlay_opacity}
                      title={tc("blog_posts", p.id, "title", p.title)}
                      height="h-40"
                    />
                    <CardContent className="pt-4 space-y-2">
                      {p.category && <Badge variant="secondary">{tc("blog_categories", p.category.id, "name", p.category.name)}</Badge>}
                      <p className="text-sm text-muted-foreground line-clamp-3">{tc("blog_posts", p.id, "excerpt", p.excerpt)}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.author_name ?? "CoffeePlanets"} · {formatDate(p.published_at)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
