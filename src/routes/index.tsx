import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  LineChart,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SB Stocks — Practice Stock Trading with Virtual Money" },
      {
        name: "description",
        content:
          "Learn to trade US stocks risk-free. SB Stocks is a virtual trading simulator with live market data, portfolios, and analytics.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <TrendingUp className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">SB Stocks</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_60%)] opacity-30" />
        <div className="mx-auto grid max-w-screen-xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Virtual money. Real market data.
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Master the markets,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                risk-free.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Practice stock trading with virtual money using live US market data. Build portfolios,
              test strategies, and track performance — without risking a single dollar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg">
                  Create Free Account
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">I have an account</Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" />
                $100k virtual starter balance
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" />
                Live US stock prices
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" />
                No credit card required
              </span>
            </div>
          </div>

          {/* Mock dashboard preview */}
          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Portfolio</p>
                  <p className="mt-1 text-3xl font-semibold">$112,438.20</p>
                </div>
                <span className="rounded-full bg-[color:var(--success)]/10 px-2.5 py-1 text-xs font-semibold text-[color:var(--success)]">
                  +12.44%
                </span>
              </div>
              <div className="mt-6 h-32 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { s: "AAPL", p: "+1.12%" },
                  { s: "NVDA", p: "+4.46%" },
                  { s: "TSLA", p: "-1.71%" },
                ].map((x) => (
                  <div key={x.s} className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">{x.s}</p>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        x.p.startsWith("-") ? "text-destructive" : "text-[color:var(--success)]"
                      }`}
                    >
                      {x.p}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-card md:block">
              <p className="text-xs text-muted-foreground">Today's P/L</p>
              <p className="text-lg font-semibold text-[color:var(--success)]">+$1,284.55</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-card/40 py-20">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Everything you need to learn trading
            </h2>
            <p className="mt-3 text-muted-foreground">
              A full simulator built on the same primitives professional traders use.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: LineChart,
                title: "Live market data",
                desc: "Real-time US stock prices, historical charts, and per-symbol analytics.",
              },
              {
                icon: Wallet,
                title: "Virtual portfolios",
                desc: "Track holdings, average price, current value, and P/L across positions.",
              },
              {
                icon: BarChart3,
                title: "Order types",
                desc: "Practice both intraday and delivery orders with realistic flows.",
              },
              {
                icon: ShieldCheck,
                title: "Zero risk",
                desc: "Trade with simulated money — perfect for beginners and strategy testing.",
              },
              {
                icon: TrendingUp,
                title: "Performance insights",
                desc: "Daily, overall, and per-stock profit/loss surfaced where it matters.",
              },
              {
                icon: Sparkles,
                title: "Built for the MERN stack",
                desc: "Clean React frontend, ready to plug into your Express + MongoDB backend.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-card"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How it works</h2>
            <p className="mt-3 text-muted-foreground">
              Start trading in three simple steps.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Create your account", d: "Sign up in seconds and receive $100,000 in virtual money." },
              { n: "02", t: "Search & analyze", d: "Find any US stock, read live prices, and study historical charts." },
              { n: "03", t: "Trade & track", d: "Place buy/sell orders and watch your portfolio grow." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <p className="text-sm font-semibold text-primary">{s.n}</p>
                <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-border bg-card/40 py-20">
        <div className="mx-auto grid max-w-screen-xl gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Why traders choose SB Stocks
            </h2>
            <p className="mt-4 text-muted-foreground">
              A purpose-built simulator that mirrors a real brokerage experience without exposing you
              to market risk. Perfect for students, beginners, and anyone exploring new strategies.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Practice without losing real money",
                "Understand order flow before going live",
                "Compare portfolios and refine your edge",
                "Clean analytics for confident decisions",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/register">
                <Button size="lg">Start trading free</Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "10k+", v: "Active learners" },
              { k: "500+", v: "US tickers" },
              { k: "$50M", v: "Virtual volume" },
              { k: "24/7", v: "Practice access" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft"
              >
                <p className="text-3xl font-semibold text-primary">{s.k}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
