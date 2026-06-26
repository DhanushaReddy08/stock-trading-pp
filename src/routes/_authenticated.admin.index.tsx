import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, ListOrdered, Receipt, BarChart3 } from "lucide-react";
import { DUMMY_USERS, DUMMY_ORDERS, DUMMY_TRANSACTIONS, DUMMY_STOCKS } from "@/utils/dummy";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — SB Stocks" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: DUMMY_USERS.length, icon: Users, to: "/admin/users" },
    { label: "Total Orders", value: DUMMY_ORDERS.length, icon: ListOrdered, to: "/admin/orders" },
    {
      label: "Total Transactions",
      value: DUMMY_TRANSACTIONS.length,
      icon: Receipt,
      to: "/admin/transactions",
    },
    { label: "Total Stocks", value: DUMMY_STOCKS.length, icon: BarChart3, to: "/admin" as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform overview and management for SB Stocks.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold">{s.value}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-muted-foreground">Recent Users</h2>
          <ul className="mt-3 divide-y divide-border">
            {DUMMY_USERS.slice(0, 4).map((u) => (
              <li key={u.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{u.username}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className="text-xs font-semibold">${u.balance.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-muted-foreground">Recent Orders</h2>
          <ul className="mt-3 divide-y divide-border">
            {DUMMY_ORDERS.slice(0, 4).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">
                    {o.symbol}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      · {o.action} {o.quantity}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{o.user}</p>
                </div>
                <span className="text-xs font-semibold">${(o.price * o.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
