import { createFileRoute } from "@tanstack/react-router";
import { DUMMY_TRANSACTIONS } from "@/utils/dummy";

export const Route = createFileRoute("/_authenticated/admin/transactions")({
  head: () => ({ meta: [{ title: "Admin · Transactions — SB Stocks" }] }),
  component: AdminTransactionsPage,
});

function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">Deposits, withdrawals and trade settlements.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Payment Mode</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_TRANSACTIONS.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">trader-{t.id.slice(-3)}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    ${(t.price * t.quantity).toFixed(2)}
                  </td>
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
                  <td className="px-4 py-3 text-muted-foreground">Virtual Wallet</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
