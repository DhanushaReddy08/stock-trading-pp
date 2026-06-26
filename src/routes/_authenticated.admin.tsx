import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/home" });
  }, [loading, isAdmin, navigate]);

  if (loading || !isAdmin) return <Loading label="Verifying admin access..." />;
  return <Outlet />;
}
