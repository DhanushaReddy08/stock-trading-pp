import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Newspaper } from "lucide-react";
import StockCard from "@/components/StockCard";
import StockTable from "@/components/StockTable";
import SearchBar from "@/components/SearchBar";
import { DUMMY_STOCKS } from "@/utils/dummy";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [{ title: "Dashboard — SB Stocks" }] }),
  component: HomePage,
});

function HomePage() {
  const { user } = useAuth();
  const trending = DUMMY_STOCKS.slice(0, 4);
  const gainers = [...DUMMY_STOCKS].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
  const losers = [...DUMMY_STOCKS].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);
  const watchlist = DUMMY_STOCKS.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user?.username ?? "trader"} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's a quick look at today's US markets.
          </p>
        </div>
        <div className="md:w-96 md:hidden">
          <SearchBar />
        </div>
      </div>

      {/* Market overview */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "S&P 500", val: "5,432.10", chg: "+0.42%", up: true },
          { label: "NASDAQ", val: "17,820.55", chg: "+0.91%", up: true },
          { label: "DOW JONES", val: "39,150.08", chg: "-0.18%", up: false },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <p className="mt-2 text-2xl font-semibold">{m.val}</p>
            <p
              className={`mt-1 flex items-center gap-1 text-xs font-semibold ${
                m.up ? "text-[color:var(--success)]" : "text-destructive"
              }`}
            >
              {m.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {m.chg}
            </p>
          </div>
        ))}
      </section>

      {/* Trending */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trending Stocks</h2>
          <span className="text-xs text-muted-foreground">Live · refreshed every minute</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((s) => <StockCard key={s.symbol} stock={s} />)}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-[color:var(--success)]">Top Gainers</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {gainers.map((s) => <StockCard key={s.symbol} stock={s} />)}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-destructive">Top Losers</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {losers.map((s) => <StockCard key={s.symbol} stock={s} />)}
          </div>
        </section>
      </div>

      {/* Watchlist */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Your Watchlist</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {watchlist.map((s) => <StockCard key={s.symbol} stock={s} />)}
        </div>
      </section>

      {/* Popular stocks table */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Popular Stocks</h2>
        <StockTable stocks={DUMMY_STOCKS} />
      </section>

      {/* News placeholder */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Latest Market News</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <article key={i} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Newspaper className="h-5 w-5" />
              </span>
              <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Markets</p>
              <h3 className="mt-1 text-sm font-semibold">
                Fed signals stable rates as inflation cools across major sectors.
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">2h ago · Reuters</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
