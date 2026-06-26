import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Briefcase,
  History,
  User,
  Shield,
  Users,
  ListOrdered,
  Receipt,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const traderLinks = [
  { to: "/home", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const adminLinks = [
  { to: "/admin", label: "Overview", icon: Shield },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/orders", label: "Orders", icon: ListOrdered },
  { to: "/admin/transactions", label: "Transactions", icon: Receipt },
] as const;

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col gap-6 p-4">
        <div>
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            Trading
          </p>
          <nav className="flex flex-col gap-1">
            {traderLinks.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {isAdmin && (
          <div>
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              Admin
            </p>
            <nav className="flex flex-col gap-1">
              {adminLinks.map((l) => {
                const active = pathname === l.to || pathname.startsWith(l.to + "/");
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        <div className="mt-auto rounded-2xl bg-sidebar-accent/40 p-4 text-xs text-sidebar-foreground/80">
          <p className="font-semibold text-sidebar-foreground">Virtual Trading</p>
          <p className="mt-1">Trade US stocks with simulated money. No real funds at risk.</p>
        </div>
      </div>
    </aside>
  );
}
