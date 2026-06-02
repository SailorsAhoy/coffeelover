import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImagePlus, Trash2, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface Props {
  shopId: number | string;
}

interface Photo {
  id: string;
  storage_path: string;
  caption: string | null;
  uploaded_by: string | null;
  kind: "official" | "user";
  url: string;
}

const BUCKET = "shop-photos";
const MAX_BYTES = 5 * 1024 * 1024;

export const ShopGallery = ({ shopId }: Props) => {
  const { user, can } = useCurrentUser();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"official" | "user">("official");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isManager = can("list_shop");
  // Regular signed-in users may contribute to the community gallery
  const canContribute = !!user;

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shop_photos")
      .select("id, storage_path, caption, uploaded_by, kind")
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

  const validate = (file: File): string | null => {
    if (!file.type.startsWith("image/")) return "Only image files are allowed";
    if (file.size > MAX_BYTES) return "Max file size is 5MB";
    return null;
  };

  const uploadFile = async (file: File, kind: "official" | "user") => {
    const err = validate(file);
    if (err) {
      toast.error(err);
      return;
    }
    if (!user) return;
    setUploading(true);
    setProgress(10);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${user.id}/${shopId}/${crypto.randomUUID()}.${ext}`;

    // Simulate progress while upload runs (supabase-js v2 does not stream progress)
    const tick = setInterval(
      () => setProgress((p) => Math.min(p + 8, 85)),
      120,
    );

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });

    clearInterval(tick);

    if (upErr) {
      setProgress(0);
      setUploading(false);
      toast.error("Upload failed");
      return;
    }
    setProgress(95);
    const { error: insErr } = await supabase.from("shop_photos").insert({
      shop_id: String(shopId),
      storage_path: path,
      uploaded_by: user.id,
      kind,
    });
    if (insErr) {
      await supabase.storage.from(BUCKET).remove([path]);
      toast.error("Could not save photo");
      setUploading(false);
      setProgress(0);
      return;
    }
    setProgress(100);
    toast.success(kind === "official" ? "Shop photo added" : "Photo shared");
    setTimeout(() => setProgress(0), 400);
    setUploading(false);
    load();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const kind: "official" | "user" =
      activeTab === "official" && isManager ? "official" : "user";
    uploadFile(files[0], kind);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!canContribute) return;
    handleFiles(e.dataTransfer.files);
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

  const canDelete = (p: Photo) => {
    if (!user) return false;
    if (p.kind === "official") return isManager;
    return p.uploaded_by === user.id || isManager;
  };

  const canUploadHere =
    (activeTab === "official" && isManager) ||
    (activeTab === "user" && canContribute);

  const renderList = (items: Photo[]) =>
    loading ? (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
      </div>
    ) : items.length === 0 ? (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">
        {activeTab === "official"
          ? "No shop photos yet"
          : "No community photos yet"}
      </div>
    ) : (
      <Carousel opts={{ align: "start", loop: items.length > 1 }}>
        <CarouselContent>
          {items.map((p) => (
            <CarouselItem key={p.id} className="basis-4/5 sm:basis-1/2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <img
                  src={p.url}
                  alt={p.caption ?? "Shop photo"}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {canDelete(p) && (
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
        {items.length > 1 && (
          <>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </>
        )}
      </Carousel>
    );

  const official = photos.filter((p) => p.kind === "official");
  const community = photos.filter((p) => p.kind === "user");

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onInput}
        disabled={uploading}
      />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "official" | "user")}
      >
        <div className="flex items-center justify-between gap-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="official">
              Shop ({official.length})
            </TabsTrigger>
            <TabsTrigger value="user">
              Community ({community.length})
            </TabsTrigger>
          </TabsList>
          {canUploadHere && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              Add
            </Button>
          )}
        </div>

        {uploading && (
          <div className="space-y-1 pt-1">
            <Progress value={progress} className="h-1.5" />
            <p className="text-[11px] text-muted-foreground">
              Uploading… {progress}%
            </p>
          </div>
        )}

        {canUploadHere && !uploading && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-3 py-4 text-center text-xs transition-colors ${
              dragOver
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            <UploadCloud className="h-5 w-5" />
            <span>Drop an image or tap to upload</span>
            <span className="text-[10px] opacity-70">
              JPG, PNG, WebP · up to 5MB
            </span>
          </div>
        )}

        <TabsContent value="official" className="mt-3">
          {renderList(official)}
        </TabsContent>
        <TabsContent value="user" className="mt-3">
          {renderList(community)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopGallery;
