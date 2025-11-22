import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ShopType {
  id: string;
  name: string;
  icon_color: string;
  icon_url: string | null;
  created_at: string;
  updated_at: string;
}

const ShopTypesManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<ShopType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon_color: "#8B4513",
    icon_url: "",
  });

  // Fetch shop types
  const { data: shopTypes, isLoading } = useQuery({
    queryKey: ["shop-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shop_types")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as ShopType[];
    },
  });

  // Create shop type mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("shop_types").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-types"] });
      toast({ title: "Shop type created successfully" });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating shop type",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update shop type mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("shop_types")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-types"] });
      toast({ title: "Shop type updated successfully" });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error updating shop type",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete shop type mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Check if any shops are using this type
      const { data: shops } = await supabase
        .from("coffee_shop_profiles")
        .select("id")
        .eq("shop_type_id", id)
        .limit(1);

      const { data: roasters } = await supabase
        .from("roaster_profiles")
        .select("id")
        .eq("shop_type_id", id)
        .limit(1);

      if ((shops && shops.length > 0) || (roasters && roasters.length > 0)) {
        throw new Error("Cannot delete shop type that has existing shops attached");
      }

      const { error } = await supabase.from("shop_types").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-types"] });
      toast({ title: "Shop type deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting shop type",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (type?: ShopType) => {
    if (type) {
      setEditingType(type);
      setFormData({
        name: type.name,
        icon_color: type.icon_color,
        icon_url: type.icon_url || "",
      });
    } else {
      setEditingType(null);
      setFormData({
        name: "",
        icon_color: "#8B4513",
        icon_url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingType(null);
    setFormData({
      name: "",
      icon_color: "#8B4513",
      icon_url: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      updateMutation.mutate({ id: editingType.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this shop type?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shop Types</h1>
          <p className="text-muted-foreground">
            Manage shop type categories with custom icons and colors
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Shop Type
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Shop types with existing shops attached can be edited but not deleted.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopTypes?.map((type) => (
          <Card key={type.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: type.icon_color }}
                >
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                {type.name}
              </CardTitle>
              <CardDescription>Color: {type.icon_color}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenDialog(type)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(type.id)}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Edit Shop Type" : "Create Shop Type"}
            </DialogTitle>
            <DialogDescription>
              {editingType
                ? "Update the shop type details"
                : "Add a new shop type category"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Type Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Coffee Shop"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon_color">Icon Color (Hex)</Label>
              <div className="flex gap-2">
                <Input
                  id="icon_color"
                  type="color"
                  value={formData.icon_color}
                  onChange={(e) =>
                    setFormData({ ...formData, icon_color: e.target.value })
                  }
                  className="w-20"
                />
                <Input
                  value={formData.icon_color}
                  onChange={(e) =>
                    setFormData({ ...formData, icon_color: e.target.value })
                  }
                  placeholder="#8B4513"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This will be the pin outer color (icon will be white)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon_url">Icon PNG URL (optional)</Label>
              <Input
                id="icon_url"
                value={formData.icon_url}
                onChange={(e) =>
                  setFormData({ ...formData, icon_url: e.target.value })
                }
                placeholder="https://example.com/icon.png"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use default coffee shop icon
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingType ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopTypesManagement;
