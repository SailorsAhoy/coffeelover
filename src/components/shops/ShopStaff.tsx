import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  shopId: number | string;
}

interface StaffRow {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_path: string | null;
  managed_by: string | null;
  staff_user_id: string | null;
  photo_url?: string;
}

const BUCKET = "shop-photos";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const staffSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Enter the user's email or user ID"),
  role: z.string().trim().min(1, "Role required").max(80),
  bio: z.string().trim().max(500).optional(),
});

export const ShopStaff = ({ shopId }: Props) => {
  const { user, can } = useCurrentUser();
  const isManager = can("list_shop");
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StaffRow | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [identifier, setIdentifier] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shop_staff")
      .select("id, name, role, bio, photo_path, managed_by, staff_user_id")
      .eq("shop_id", String(shopId))
      .order("created_at", { ascending: true });
    if (error) {
      toast.error("Could not load staff");
      setLoading(false);
      return;
    }
    const signed = await Promise.all(
      (data ?? []).map(async (s) => {
        if (!s.photo_path) return s as StaffRow;
        const { data: sg } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(s.photo_path, 60 * 60);
        return { ...s, photo_url: sg?.signedUrl } as StaffRow;
      }),
    );
    setStaff(signed);
    setLoading(false);
  }, [shopId]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEditing(null);
    setName("");
    setRole("");
    setBio("");
    setPhotoFile(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };
  const openEdit = (s: StaffRow) => {
    setEditing(s);
    setName(s.name);
    setRole(s.role);
    setBio(s.bio ?? "");
    setPhotoFile(null);
    setOpen(true);
  };

  const save = async () => {
    if (!user) return;
    const parsed = staffSchema.safeParse({ name, role, bio });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    let photo_path = editing?.photo_path ?? null;

    if (photoFile) {
      if (!photoFile.type.startsWith("image/")) {
        toast.error("Photo must be an image");
        setSaving(false);
        return;
      }
      if (photoFile.size > 3 * 1024 * 1024) {
        toast.error("Photo must be under 3MB");
        setSaving(false);
        return;
      }
      const ext = (photoFile.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${user.id}/${shopId}/staff/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, photoFile, { contentType: photoFile.type });
      if (upErr) {
        toast.error("Photo upload failed");
        setSaving(false);
        return;
      }
      photo_path = path;
    }

    const payload = {
      shop_id: String(shopId),
      name: parsed.data.name,
      role: parsed.data.role,
      bio: parsed.data.bio || null,
      photo_path,
      managed_by: user.id,
    };

    const { error } = editing
      ? await supabase.from("shop_staff").update(payload).eq("id", editing.id)
      : await supabase.from("shop_staff").insert(payload);

    if (error) {
      toast.error("Could not save staff member");
      setSaving(false);
      return;
    }
    toast.success(editing ? "Staff updated" : "Staff added");
    setSaving(false);
    setOpen(false);
    resetForm();
    load();
  };

  const remove = async (s: StaffRow) => {
    const { error } = await supabase.from("shop_staff").delete().eq("id", s.id);
    if (error) {
      toast.error("Could not remove");
      return;
    }
    if (s.photo_path) {
      await supabase.storage.from(BUCKET).remove([s.photo_path]);
    }
    toast.success("Staff removed");
    load();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {isManager && (
        <div className="flex justify-end">
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1" onClick={openCreate}>
                <Plus className="h-4 w-4" /> Add staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit staff member" : "Add staff member"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={
                        photoFile
                          ? URL.createObjectURL(photoFile)
                          : editing?.photo_url
                      }
                    />
                    <AvatarFallback>
                      {(name || "?").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        setPhotoFile(e.target.files?.[0] ?? null)
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="cursor-pointer gap-1"
                    >
                      <span>
                        <Upload className="h-3.5 w-3.5" />
                        {editing?.photo_path ? "Change photo" : "Upload photo"}
                      </span>
                    </Button>
                  </label>
                </div>
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    placeholder="Maya Chen"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    maxLength={80}
                    placeholder="Head Barista"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Short bio (optional)"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {bio.length}/500
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={save} disabled={saving}>
                  {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {staff.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            No staff listed yet.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {staff.map((s) => {
            const canEdit = isManager && user?.id === s.managed_by;
            return (
              <li key={s.id}>
                <Card>
                  <CardContent className="flex items-start gap-3 p-3">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={s.photo_url} alt={s.name} />
                      <AvatarFallback>
                        {s.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {s.role}
                      </p>
                      {s.bio && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {s.bio}
                        </p>
                      )}
                    </div>
                    {canEdit && (
                      <div className="flex flex-col gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => openEdit(s)}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => remove(s)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ShopStaff;
