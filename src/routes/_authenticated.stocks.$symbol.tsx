import { createFileRoute, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import StockChart from "@/components/StockChart";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DUMMY_STOCKS, generateHistory } from "@/utils/dummy";
import { ORDER_TYPES } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/_authenticated/stocks/$symbol")({
  head: ({ params }) => ({
    meta: [{ title: `${params.symbol} — SB Stocks` }],
  }),
  component: StockDetailsPage,
});

function StockDetailsPage() {
  const { symbol } = useParams({ from: "/_authenticated/stocks/$symbol" });
  const { user, updateUser } = useAuth();
  const stock = DUMMY_STOCKS.find((s) => s.symbol === symbol.toUpperCase());

  const history = useMemo(() => (stock ? generateHistory(stock.price) : []), [stock]);

  const [action, setAction] = useState<"BUY" | "SELL">("BUY");
  const [qty, setQty] = useState(1);
  const [orderType, setOrderType] = useState<"INTRADAY" | "DELIVERY">("DELIVERY");

  if (!stock) {
    return (
      <EmptyState
        title={`No stock found for "${symbol}"`}
        description="Try searching for another ticker."
      />
    );
  }

  const up = stock.change >= 0;
  const total = qty * stock.price;

  const onConfirm = () => {
    if (qty <= 0) return toast.error("Quantity must be greater than zero.");
    if (action === "BUY") {
      if (total > (user?.balance ?? 0)) return toast.error("Insufficient balance.");
      updateUser({ balance: (user?.balance ?? 0) - total });
      toast.success(`Bought ${qty} ${stock.symbol} @ $${stock.price.toFixed(2)}`);
    } else {
      updateUser({ balance: (user?.balance ?? 0) + total });
      toast.success(`Sold ${qty} ${stock.symbol} @ $${stock.price.toFixed(2)}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{stock.symbol}</h1>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                {stock.exchange}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{stock.name}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-semibold">${stock.price.toFixed(2)}</p>
            <p
              className={`mt-1 flex items-center justify-end gap-1 text-sm font-semibold ${
                up ? "text-[color:var(--success)]" : "text-destructive"
              }`}
            >
              {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {up ? "+" : ""}
              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
            Historical Price (60 days)
          </h2>
          <StockChart data={history} up={up} />
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex rounded-xl bg-muted p-1">
            <button
              onClick={() => setAction("BUY")}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                action === "BUY"
                  ? "bg-[color:var(--success)] text-white"
                  : "text-muted-foreground"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setAction("SELL")}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                action === "SELL"
                  ? "bg-destructive text-destructive-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Sell
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Order Type</Label>
              <Select value={orderType} onValueChange={(v) => setOrderType(v as "INTRADAY" | "DELIVERY")}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_TYPES.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl bg-muted/60 p-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Price</span>
                <span className="font-medium text-foreground">${stock.price.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-muted-foreground">
                <span>Estimated Total</span>
                <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={onConfirm} className="w-full" size="lg">
              Confirm {action}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Available balance: ${(user?.balance ?? 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
