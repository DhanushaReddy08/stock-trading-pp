import { Link, useRouter } from "@tanstack/react-router";
import { LogOut, TrendingUp, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <TrendingUp className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">SB Stocks</span>
        </Link>

        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>

        <nav className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted sm:flex"
              >
                <UserIcon className="h-4 w-4" />
                {user?.username ?? "Account"}
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  router.navigate({ to: "/login" });
                }}
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
