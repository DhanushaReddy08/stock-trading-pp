import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Wallet, TrendingUp, TrendingDown, Briefcase } from "lucide-react";
import PortfolioCard from "@/components/PortfolioCard";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { DUMMY_HOLDINGS } from "@/utils/dummy";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/_authenticated/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio — SB Stocks" }] }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { user } = useAuth();
  const holdings = DUMMY_HOLDINGS;

  const stats = useMemo(() => {
    const invested = holdings.reduce((a, h) => a + h.quantity * h.avgPrice, 0);
    const value = holdings.reduce((a, h) => a + h.quantity * h.currentPrice, 0);
    const overall = value - invested;
    const today = overall * 0.18; // illustrative
    return { invested, value, overall, today };
  }, [holdings]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Track holdings, value, and profit/loss across your positions.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Available Balance" value={`$${(user?.balance ?? 0).toFixed(2)}`} icon={Wallet} />
        <StatCard label="Portfolio Value" value={`$${stats.value.toFixed(2)}`} icon={Briefcase} />
        <StatCard
          label="Today's P/L"
          value={`${stats.today >= 0 ? "+" : ""}$${stats.today.toFixed(2)}`}
          icon={stats.today >= 0 ? TrendingUp : TrendingDown}
          tone={stats.today >= 0 ? "success" : "destructive"}
        />
        <StatCard
          label="Overall P/L"
          value={`${stats.overall >= 0 ? "+" : ""}$${stats.overall.toFixed(2)}`}
          icon={stats.overall >= 0 ? TrendingUp : TrendingDown}
          tone={stats.overall >= 0 ? "success" : "destructive"}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Holdings</h2>
        {holdings.length === 0 ? (
          <EmptyState
            title="Your portfolio is empty"
            description="Start by buying your first stock from the dashboard."
            action={
              <Link to="/home">
                <Button>Browse Stocks</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {holdings.map((h) => (
              <PortfolioCard key={h.symbol} holding={h} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "success" | "destructive";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            tone === "success"
              ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
              : tone === "destructive"
              ? "bg-destructive/10 text-destructive"
              : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p
        className={`mt-3 text-2xl font-semibold ${
          tone === "success"
            ? "text-[color:var(--success)]"
            : tone === "destructive"
            ? "text-destructive"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
