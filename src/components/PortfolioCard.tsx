import { Link } from "@tanstack/react-router";
import type { Holding } from "@/utils/dummy";
import { Button } from "@/components/ui/button";

export default function PortfolioCard({ holding }: { holding: Holding }) {
  const value = holding.quantity * holding.currentPrice;
  const invested = holding.quantity * holding.avgPrice;
  const pnl = value - invested;
  const pct = (pnl / invested) * 100;
  const up = pnl >= 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold">{holding.symbol}</p>
          <p className="text-xs text-muted-foreground">{holding.name}</p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            up
              ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {up ? "+" : ""}
          {pct.toFixed(2)}%
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Qty</p>
          <p className="font-medium">{holding.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Avg Price</p>
          <p className="font-medium">${holding.avgPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="font-medium">${holding.currentPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Value</p>
          <p className="font-medium">${value.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">P/L</p>
          <p className={`font-semibold ${up ? "text-[color:var(--success)]" : "text-destructive"}`}>
            {up ? "+" : ""}${pnl.toFixed(2)}
          </p>
        </div>
        <Link to="/stocks/$symbol" params={{ symbol: holding.symbol }}>
          <Button size="sm" variant="outline">View Stock</Button>
        </Link>
      </div>
    </div>
  );
}
