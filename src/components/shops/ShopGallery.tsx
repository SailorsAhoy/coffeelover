import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  shopId: number | string;
}

interface Photo {
  id: string;
  storage_path: string;
  caption: string | null;
  uploaded_by: string | null;
  url: string;
}

const BUCKET = "shop-photos";

export const ShopGallery = ({ shopId }: Props) => {
  const { user, can } = useCurrentUser();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const canManage = can("list_shop");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shop_photos")
      .select("id, storage_path, caption, uploaded_by")
      .eq("shop_id", String(shopId))
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Could not load photos");
      setLoading(false);
      return;
    }

    const signed = await Promise.all(
      (data ?? []).map(async (p) => {
        const { data: s } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(p.storage_path, 60 * 60);
        return { ...p, url: s?.signedUrl ?? "" } as Photo;
      }),
    );
    setPhotos(signed.filter((p) => p.url));
    setLoading(false);
  }, [shopId]);

  useEffect(() => {
    load();
  }, [load]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${shopId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });
    if (upErr) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }
    const { error: insErr } = await supabase.from("shop_photos").insert({
      shop_id: String(shopId),
      storage_path: path,
      uploaded_by: user.id,
    });
    if (insErr) {
      await supabase.storage.from(BUCKET).remove([path]);
      toast.error("Could not save photo");
      setUploading(false);
      return;
    }
    toast.success("Photo added");
    setUploading(false);
    load();
  };

  const remove = async (p: Photo) => {
    const { error } = await supabase.from("shop_photos").delete().eq("id", p.id);
    if (error) {
      toast.error("Could not delete");
      return;
    }
    await supabase.storage.from(BUCKET).remove([p.storage_path]);
    toast.success("Photo removed");
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Gallery</h3>
        {canManage && (
          <label className="inline-flex">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onUpload}
              disabled={uploading}
            />
            <Button
              size="sm"
              variant="outline"
              asChild
              disabled={uploading}
              className="gap-1 cursor-pointer"
            >
              <span>
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="h-3.5 w-3.5" />
                )}
                Add photo
              </span>
            </Button>
          </label>
        )}
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : photos.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          No photos yet
        </div>
      ) : (
        <Carousel opts={{ align: "start", loop: photos.length > 1 }}>
          <CarouselContent>
            {photos.map((p) => (
              <CarouselItem key={p.id} className="basis-4/5 sm:basis-1/2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                  <img
                    src={p.url}
                    alt={p.caption ?? "Shop photo"}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {canManage && user?.id === p.uploaded_by && (
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => remove(p)}
                      className="absolute right-2 top-2 h-8 w-8"
                      aria-label="Delete photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {photos.length > 1 && (
            <>
              <CarouselPrevious className="left-1" />
              <CarouselNext className="right-1" />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
};

export default ShopGallery;
