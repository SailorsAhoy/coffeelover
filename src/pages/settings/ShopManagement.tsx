import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  SHOPS, SHOP_TYPE_LABEL, getShopWithOverrides, deleteShop,
  subscribeShopOverrides, type Shop, type ShopType,
} from "@/lib/shopsData";
import ShopEditSheet from "@/components/shops/ShopEditSheet";
import ShopCreateSheet from "@/components/shops/ShopCreateSheet";

const TYPE_FILTERS: { key: ShopType; label: string }[] = [
  { key: "coffee_shop", label: "Coffee Shops" },
  { key: "roaster_shop", label: "Roasteries" },
  { key: "bakery", label: "Bakeries" },
  { key: "veggie", label: "Vegan Cafés" },
];

const ShopManagement = () => {
  const [, force] = useState(0);
  const [search, setSearch] = useState("");
  const [enabled, setEnabled] = useState<Record<ShopType, boolean>>({
    coffee_shop: true, roaster_shop: true, bakery: true, veggie: true,
  });
  const [pendingDelete, setPendingDelete] = useState<Shop | null>(null);

  useEffect(() => subscribeShopOverrides(() => force((n) => n + 1)), []);

  const shops: Shop[] = useMemo(
    () => SHOPS.map((s) => getShopWithOverrides(s.id) ?? s),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return shops
      .filter((s) => enabled[s.type])
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q),
      );
  }, [shops, enabled, search]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Shop Management</CardTitle>
              <CardDescription>
                Manage coffee shops, roasteries, bakeries, and vegan cafés
              </CardDescription>
            </div>
            <ShopCreateSheet
              trigger={
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Add Shop
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Shops</Label>
              <Input
                id="search"
                placeholder="Search by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Filter by Type</Label>
              <div className="flex flex-wrap gap-4">
                {TYPE_FILTERS.map((t) => (
                  <div key={t.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${t.key}`}
                      checked={enabled[t.key]}
                      onCheckedChange={(v) =>
                        setEnabled((p) => ({ ...p, [t.key]: !!v }))
                      }
                    />
                    <Label htmlFor={`filter-${t.key}`} className="cursor-pointer">
                      {t.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {filtered.length} of {shops.length} shops
            </p>

            <div className="border rounded-lg divide-y">
              {filtered.length === 0 && (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  No shops match.
                </p>
              )}
              {filtered.map((shop) => (
                <div
                  key={shop.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-accent/50"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold truncate">{shop.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {SHOP_TYPE_LABEL[shop.type]} · {shop.address}
                    </p>
                    {(shop.status === "pending" || shop.pendingReview) && (
                      <span className="mt-1 inline-block text-[11px] text-amber-700 dark:text-amber-400">
                        Under review
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button variant="ghost" size="icon" asChild title="Open shop">
                      <Link to={`/shop/${shop.id}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                    <ShopEditSheet shop={shop} />
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete shop"
                      onClick={() => setPendingDelete(shop)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this shop?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} will be removed from the directory. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) {
                  deleteShop(pendingDelete.id);
                  toast.success(`${pendingDelete.name} deleted`);
                }
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShopManagement;
