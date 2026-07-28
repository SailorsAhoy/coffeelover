import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAppSetting } from "@/hooks/useAppSetting";

interface Props {
  children: ReactNode;
  slug: string;
}

export const GatedRoute = ({ children, slug }: Props) => {
  const { loading: authLoading, isAuthenticated } = useCurrentUser();
  const { value: enabled, loading: settingLoading } = useAppSetting<boolean>("gated_preview_enabled", false);
  const location = useLocation();

  if (authLoading || settingLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (enabled && !isAuthenticated) {
    return <Navigate to={`/welcome/${slug}`} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
