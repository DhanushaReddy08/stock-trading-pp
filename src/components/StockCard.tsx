import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Stock } from "@/utils/dummy";

export default function StockCard({ stock }: { stock: Stock }) {
  const up = stock.change >= 0;
  return (
    <Link
      to="/stocks/$symbol"
      params={{ symbol: stock.symbol }}
      className="group block rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide">{stock.symbol}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{stock.name}</p>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
          {stock.exchange}
        </span>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <p className="text-2xl font-semibold tracking-tight">${stock.price.toFixed(2)}</p>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            up
              ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {up ? "+" : ""}
          {stock.changePercent.toFixed(2)}%
        </span>
      </div>
    </Link>
  );
}
