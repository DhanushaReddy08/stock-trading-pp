import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DUMMY_TRANSACTIONS } from "@/utils/dummy";
import EmptyState from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TXN_FILTERS } from "@/utils/constants";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "Transaction History — SB Stocks" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [filter, setFilter] = useState<(typeof TXN_FILTERS)[number]>("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const rows = useMemo(() => {
    return DUMMY_TRANSACTIONS.filter((t) => {
      if (filter !== "ALL" && t.action !== filter) return false;
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      return true;
    });
  }, [filter, from, to]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transaction History</h1>
        <p className="text-sm text-muted-foreground">All your buys and sells in one place.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft md:flex-row md:items-end">
        <div className="flex flex-wrap gap-2">
          {TXN_FILTERS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
            >
              {f === "ALL" ? "All" : f}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs text-muted-foreground">From</label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">To</label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Try adjusting your filters or place your first trade."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Stock</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                    <td className="px-4 py-3 font-semibold">{t.symbol}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          t.action === "BUY"
                            ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {t.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{t.quantity}</td>
                    <td className="px-4 py-3 text-right">${t.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      ${(t.price * t.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          t.status === "COMPLETED"
                            ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                            : t.status === "PENDING"
                            ? "bg-[color:var(--warning)]/15 text-[color:var(--warning-foreground)]"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
