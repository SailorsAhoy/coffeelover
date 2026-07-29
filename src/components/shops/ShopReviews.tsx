import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Star, Plus, ImagePlus, X, Loader2, Pencil, Trash2 } from "lucide-react";
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
  /** Shop id used to attach uploaded review photos to the shop's community gallery. */
  shopId?: number | string;
  fallbackRating?: number;
  fallbackCount?: number;
}

const PHOTO_BUCKET = "shop-photos";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_PHOTOS = 4;

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
  shopId,
  fallbackRating,
  fallbackCount,
}: Props) => {
  const { user, can, profile } = useCurrentUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
        .from("profiles_public" as any)
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

  const resetForm = () => {
    setRating(5);
    setComment("");
    setFiles([]);
    setEditingId(null);
  };

  const openNew = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (r: Review) => {
    setEditingId(r.id);
    setRating(r.rating);
    setComment(r.comment ?? "");
    setFiles([]);
    setOpen(true);
  };

  const removeReview = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Review deleted");
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files];
    for (const f of Array.from(incoming)) {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name}: only images allowed`);
        continue;
      }
      if (f.size > MAX_PHOTO_BYTES) {
        toast.error(`${f.name}: max 5MB`);
        continue;
      }
      if (next.length >= MAX_PHOTOS) {
        toast.error(`Up to ${MAX_PHOTOS} photos per review`);
        break;
      }
      next.push(f);
    }
    setFiles(next);
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);

    if (editingId) {
      const { error } = await supabase
        .from("reviews")
        .update({
          rating,
          comment: comment.trim() || null,
        })
        .eq("id", editingId)
        .eq("user_id", user.id);

      setSubmitting(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Review updated");
      resetForm();
      setOpen(false);
      load();
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      reviewable_type: reviewableType,
      reviewable_id: reviewableId,
      rating,
      comment: comment.trim() || null,
    });

    if (error) {
      setSubmitting(false);
      toast.error(error.message);
      return;
    }

    // Upload any attached photos to the shop's community gallery
    if (files.length && shopId !== undefined) {
      let uploaded = 0;
      for (const file of files) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${user.id}/${shopId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(PHOTO_BUCKET)
          .upload(path, file, { contentType: file.type });
        if (upErr) continue;
        const { error: insErr } = await supabase.from("shop_photos").insert({
          shop_id: String(shopId),
          storage_path: path,
          uploaded_by: user.id,
          kind: "user",
          caption: comment.trim().slice(0, 140) || null,
        });
        if (insErr) {
          await supabase.storage.from(PHOTO_BUCKET).remove([path]);
          continue;
        }
        uploaded += 1;
      }
      if (uploaded > 0) {
        toast.success(
          `Review posted with ${uploaded} photo${uploaded > 1 ? "s" : ""}`,
        );
      } else {
        toast.success("Review posted");
      }
    } else {
      toast.success("Review posted");
    }

    setSubmitting(false);
    resetForm();
    setOpen(false);
    load();
  };

  const count = reviews.length || fallbackCount || 0;
  const avg =
    reviews.length > 0
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : fallbackRating ?? 0;

  const canReview = can("rate");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            Reviews
            {canReview && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 px-2 text-xs"
                onClick={openNew}
              >
                <Plus className="h-3.5 w-3.5" /> Add review
              </Button>
            )}
            {canReview && (
              <Dialog
                open={open}
                onOpenChange={(o) => {
                  setOpen(o);
                  if (!o) resetForm();
                }}
              >
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Edit your review" : "Write a review"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {(profile?.name ?? "U").slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <StarRow value={rating} size={22} onChange={setRating} />
                    </div>
                    <Textarea
                      placeholder="Share your experience…"
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, 500))}
                      rows={4}
                    />
                    <div className="text-right text-[10px] text-muted-foreground">
                      {comment.length}/500
                    </div>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />

                    {!editingId && shopId !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">
                            Photos ({files.length}/{MAX_PHOTOS})
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 px-2 text-xs"
                            disabled={files.length >= MAX_PHOTOS}
                            onClick={() => fileRef.current?.click()}
                          >
                            <ImagePlus className="h-3.5 w-3.5" /> Add photo
                          </Button>
                        </div>
                        {files.length > 0 && (
                          <div className="grid grid-cols-4 gap-2">
                            {files.map((f, i) => {
                              const url = URL.createObjectURL(f);
                              return (
                                <div
                                  key={i}
                                  className="relative aspect-square overflow-hidden rounded-md border bg-muted"
                                >
                                  <img
                                    src={url}
                                    alt={f.name}
                                    className="h-full w-full object-cover"
                                    onLoad={() => URL.revokeObjectURL(url)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeFile(i)}
                                    className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5 text-foreground shadow"
                                    aria-label="Remove photo"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground">
                          Photos are added to this shop's community gallery.
                        </p>
                      </div>
                    )}
                    {editingId && (
                      <p className="text-[10px] text-muted-foreground">
                        Photos uploaded with the original review remain in the
                        community gallery and can be removed there.
                      </p>
                    )}
                  </div>
                  <DialogFooter className="gap-2 sm:gap-2">
                    {editingId && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="mr-auto gap-1"
                            disabled={submitting}
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This cannot be undone. Photos in the community
                              gallery are kept and can be removed separately.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                const id = editingId;
                                setOpen(false);
                                resetForm();
                                if (id) await removeReview(id);
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => setOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button onClick={submit} disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingId ? "Saving…" : "Posting…"}
                        </>
                      ) : editingId ? (
                        "Save changes"
                      ) : (
                        "Post review"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </span>
          <div className="flex items-center gap-2 text-sm font-normal">
            <StarRow value={Math.round(avg)} />
            <span className="font-semibold">{avg.toFixed(1)}</span>
            <span className="text-muted-foreground">({count})</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canReview && (
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
            {reviews.map((r) => {
              const isMine = user?.id === r.user_id;
              return (
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
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                      {isMine && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 gap-1 px-2 text-[11px]"
                            onClick={() => openEdit(r)}
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 gap-1 px-2 text-[11px] text-destructive hover:text-destructive"
                                disabled={deletingId === r.id}
                              >
                                <Trash2 className="h-3 w-3" />
                                {deletingId === r.id ? "Deleting…" : "Delete"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This cannot be undone. Photos in the community
                                  gallery are kept and can be removed separately.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeReview(r.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopReviews;
