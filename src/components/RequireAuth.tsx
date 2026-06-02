import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser, type AppRole } from "@/hooks/useCurrentUser";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
  roles?: AppRole[];
}

export const RequireAuth = ({ children, roles }: Props) => {
  const { loading, isAuthenticated, hasRole } = useCurrentUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (roles && roles.length > 0 && !roles.some(hasRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
