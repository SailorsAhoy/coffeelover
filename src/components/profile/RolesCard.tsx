import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser, type AppRole } from "@/hooks/useCurrentUser";
import { Shield } from "lucide-react";

const LABELS: Record<AppRole, string> = {
  admin: "Admin",
  company: "Company",
  staff: "Staff",
  pro_user: "Pro User",
  teacher: "Teacher",
  roaster: "Roaster",
  coffee_shop: "Coffee Shop",
  producer: "Producer",
  user: "Member",
  manufacturer: "Equipment Manufacturer",
  supplier: "Supplier",
  author: "Author",
};

export const RolesCard = () => {
  const { roles, loading } = useCurrentUser();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-4 h-4" /> Roles
        </CardTitle>
        <CardDescription>What you can do on CoffeeLovers</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : roles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No roles yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <Badge key={r} variant={r === "admin" ? "default" : "secondary"}>
                {LABELS[r] ?? r}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
