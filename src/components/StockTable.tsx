import { Link } from "@tanstack/react-router";
import type { Stock } from "@/utils/dummy";

export default function StockTable({ stocks }: { stocks: Stock[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Symbol</th>
              <th className="px-4 py-3 text-left font-medium">Company</th>
              <th className="px-4 py-3 text-left font-medium">Exchange</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Change</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => {
              const up = s.change >= 0;
              return (
                <tr key={s.symbol} className="border-t border-border hover:bg-muted/40">
                  <td className="px-4 py-3 font-semibold">{s.symbol}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.exchange}</td>
                  <td className="px-4 py-3 text-right font-medium">${s.price.toFixed(2)}</td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      up ? "text-[color:var(--success)]" : "text-destructive"
                    }`}
                  >
                    {up ? "+" : ""}
                    {s.changePercent.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/stocks/$symbol"
                      params={{ symbol: s.symbol }}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
