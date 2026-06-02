import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profile?: { name: string | null; avatar_url: string | null } | null;
}

interface Props {
  reviewableId: string;
  reviewableType?: string;
  fallbackRating?: number;
  fallbackCount?: number;
}

const StarRow = ({
  value,
  size = 14,
  onChange,
}: {
  value: number;
  size?: number;
  onChange?: (v: number) => void;
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(n)}
        className={onChange ? "cursor-pointer" : "cursor-default"}
        aria-label={`${n} star${n > 1 ? "s" : ""}`}
      >
        <Star
          style={{ width: size, height: size }}
          className={n <= value ? "fill-primary text-primary" : "text-muted-foreground"}
        />
      </button>
    ))}
  </div>
);

export const ShopReviews = ({
  reviewableId,
  reviewableType = "coffee_shop",
  fallbackRating,
  fallbackCount,
}: Props) => {
  const { user, can, profile } = useCurrentUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("id, user_id, rating, comment, created_at")
      .eq("reviewable_type", reviewableType)
      .eq("reviewable_id", reviewableId)
      .order("created_at", { ascending: false });

    const list = (data ?? []) as Review[];
    if (list.length) {
      const ids = Array.from(new Set(list.map((r) => r.user_id)));
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", ids);
      const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
      list.forEach((r) => {
        r.profile = map.get(r.user_id) ?? null;
      });
    }
    setReviews(list);
    setLoading(false);
  }, [reviewableId, reviewableType]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      reviewable_type: reviewableType,
      reviewable_id: reviewableId,
      rating,
      comment: comment.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Review posted");
    setComment("");
    setRating(5);
    load();
  };

  const myReview = reviews.find((r) => r.user_id === user?.id);
  const count = reviews.length || fallbackCount || 0;
  const avg =
    reviews.length > 0
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : fallbackRating ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>Reviews</span>
          <div className="flex items-center gap-2 text-sm font-normal">
            <StarRow value={Math.round(avg)} />
            <span className="font-semibold">{avg.toFixed(1)}</span>
            <span className="text-muted-foreground">({count})</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {can("rate") ? (
          myReview ? (
            <p className="text-xs text-muted-foreground">
              You already reviewed this shop.
            </p>
          ) : (
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>
                    {(profile?.name ?? "U").slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <StarRow value={rating} size={18} onChange={setRating} />
              </div>
              <Textarea
                placeholder="Share your experience…"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                rows={3}
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={submit} disabled={submitting}>
                  {submitting ? "Posting…" : "Post review"}
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
            <Link to="/auth" className="text-primary underline">
              Sign in
            </Link>{" "}
            to leave a review.
          </div>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reviews yet. Be the first!
          </p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="flex gap-3 border-b pb-3 last:border-0">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback>
                    {(r.profile?.name ?? "U").slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {r.profile?.name ?? "Anonymous"}
                    </span>
                    <StarRow value={r.rating} />
                  </div>
                  {r.comment && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {r.comment}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopReviews;
