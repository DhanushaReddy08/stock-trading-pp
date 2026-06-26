import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { DUMMY_STOCKS } from "@/utils/dummy";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.toLowerCase();
    return DUMMY_STOCKS.filter(
      (s) => s.symbol.toLowerCase().includes(term) || s.name.toLowerCase().includes(term),
    ).slice(0, 6);
  }, [q]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 shadow-soft focus-within:ring-2 focus-within:ring-ring">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          placeholder="Search stocks by symbol or company..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-card">
          {results.map((s) => (
            <Link
              key={s.symbol}
              to="/stocks/$symbol"
              params={{ symbol: s.symbol }}
              onClick={() => {
                setOpen(false);
                setQ("");
              }}
              className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted"
            >
              <div>
                <p className="text-sm font-semibold">{s.symbol}</p>
                <p className="text-xs text-muted-foreground">{s.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">${s.price.toFixed(2)}</p>
                <p
                  className={`text-xs ${
                    s.change >= 0 ? "text-[color:var(--success)]" : "text-destructive"
                  }`}
                >
                  {s.change >= 0 ? "+" : ""}
                  {s.changePercent.toFixed(2)}%
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      {open && q.trim() && results.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-border bg-popover p-6 text-center text-sm text-muted-foreground shadow-card">
          No matches for "{q}"
        </div>
      )}
    </div>
  );
}
