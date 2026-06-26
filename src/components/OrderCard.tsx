import type { Order } from "@/utils/dummy";

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">
            {order.symbol}{" "}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              {order.orderType}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {order.action} · Qty {order.quantity} @ ${order.price.toFixed(2)}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            order.status === "COMPLETED"
              ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
              : order.status === "PENDING"
              ? "bg-[color:var(--warning)]/15 text-[color:var(--warning-foreground)]"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {order.status}
        </span>
      </div>
    </div>
  );
}
