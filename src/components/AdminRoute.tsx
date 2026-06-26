import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import Loading from "./Loading";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) navigate({ to: "/login" });
    else if (!isAdmin) navigate({ to: "/home" });
  }, [loading, isAuthenticated, isAdmin, navigate]);

  if (loading || !isAuthenticated || !isAdmin) return <Loading />;
  return <>{children}</>;
}
