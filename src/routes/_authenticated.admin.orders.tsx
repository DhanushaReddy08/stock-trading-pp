import { createFileRoute } from "@tanstack/react-router";
import { DUMMY_ORDERS } from "@/utils/dummy";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({ meta: [{ title: "Admin · Orders — SB Stocks" }] }),
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">All buy and sell orders on the platform.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Stock</th>
                <th className="px-4 py-3 text-left font-medium">Order Type</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-right font-medium">Qty</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_ORDERS.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{o.user}</td>
                  <td className="px-4 py-3 font-semibold">{o.symbol}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.orderType}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        o.action === "BUY"
                          ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {o.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{o.quantity}</td>
                  <td className="px-4 py-3 text-right">${o.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        o.status === "COMPLETED"
                          ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                          : o.status === "PENDING"
                          ? "bg-[color:var(--warning)]/15 text-[color:var(--warning-foreground)]"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
