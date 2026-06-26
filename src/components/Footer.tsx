import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-6 py-12 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">SB Stocks</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            A virtual stock trading simulator powered by live US market data.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Overview</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Get Started</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Login</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Resources</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Documentation</li>
            <li>Help Center</li>
            <li>Market News</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Risk Disclosure</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SB Stocks · Educational simulation only — not a real brokerage.
      </div>
    </footer>
  );
}
