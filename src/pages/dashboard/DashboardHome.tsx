import { Navigate } from "react-router-dom";
import { useCurrentUser, type AppRole } from "@/hooks/useCurrentUser";
import { Loader2 } from "lucide-react";

// Highest priority first
const ROLE_ROUTE: Array<[AppRole, string]> = [
  ["admin", "/dashboard/admin"],
  ["coffee_shop", "/dashboard/shop"],
  ["roaster", "/dashboard/roastery"],
  ["manufacturer", "/dashboard/manufacturer"],
  ["supplier", "/dashboard/supplier"],
  ["teacher", "/dashboard/teacher"],
  ["author", "/dashboard/author"],
  ["producer", "/dashboard/roastery"],
  ["company", "/dashboard/shop"],
  ["staff", "/dashboard/shop"],
  ["pro_user", "/dashboard/user"],
  ["user", "/dashboard/user"],
];

const DashboardHome = () => {
  const { loading, roles, isAuthenticated } = useCurrentUser();
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  const match = ROLE_ROUTE.find(([r]) => roles.includes(r));
  return <Navigate to={match?.[1] ?? "/dashboard/user"} replace />;
};

export default DashboardHome;
