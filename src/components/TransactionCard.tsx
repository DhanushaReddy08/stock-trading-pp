import type { Transaction } from "@/utils/dummy";

export default function TransactionCard({ txn }: { txn: Transaction }) {
  const buy = txn.action === "BUY";
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl text-xs font-bold ${
            buy
              ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {txn.action}
        </span>
        <div>
          <p className="text-sm font-semibold">{txn.symbol}</p>
          <p className="text-xs text-muted-foreground">
            {txn.date} · Qty {txn.quantity}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">
          ${(txn.price * txn.quantity).toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">@ ${txn.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
