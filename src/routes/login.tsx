import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, type User } from "@/context/AuthContext";

type Search = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Login — SB Stocks" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Placeholder: replace with authApi.login when backend is connected.
      await new Promise((r) => setTimeout(r, 800));
      const isAdmin = email.toLowerCase().startsWith("admin");
      const user: User = {
        id: "demo-user",
        username: email.split("@")[0],
        email,
        role: isAdmin ? "ADMIN" : "TRADER",
        balance: 100000,
      };
      login(user, "demo.jwt.token");
      toast.success("Welcome back to SB Stocks!");
      navigate({ to: redirect ?? (isAdmin ? "/admin" : "/home") });
    } catch (e) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">SB Stocks</span>
          </Link>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your virtual trading dashboard.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5"
              />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => toast.info("Password reset coming soon.")}
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden overflow-hidden bg-secondary text-secondary-foreground lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--accent)_0%,_transparent_55%)] opacity-40" />
        <div className="relative flex h-full flex-col justify-center gap-6 p-12">
          <h2 className="text-4xl font-semibold tracking-tight">
            Trade smarter. <br /> Risk nothing.
          </h2>
          <p className="max-w-md text-base text-secondary-foreground/80">
            Test strategies with live data and a $100,000 virtual balance.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wider opacity-80">Portfolio</p>
              <p className="mt-1 text-2xl font-semibold">$112,438</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wider opacity-80">Today's P/L</p>
              <p className="mt-1 text-2xl font-semibold">+$1,284</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
