import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * Back-compat hook. Prefer useCurrentUser + <RequireAuth /> in new code.
 */
export const useAuthGuard = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [loading, isAuthenticated, navigate]);

  return { isAuthenticated, loading };
};
