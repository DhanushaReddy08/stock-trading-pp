import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { History, PencilLine, Wallet, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — SB Stocks" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(user?.username ?? "");
  const [amount, setAmount] = useState("");

  const onDeposit = () => {
    const n = Number(amount);
    if (!n || n <= 0) return toast.error("Enter a valid amount.");
    updateUser({ balance: (user?.balance ?? 0) + n });
    toast.success(`Deposited $${n.toFixed(2)}`);
    setAmount("");
  };
  const onWithdraw = () => {
    const n = Number(amount);
    if (!n || n <= 0) return toast.error("Enter a valid amount.");
    if (n > (user?.balance ?? 0)) return toast.error("Insufficient balance.");
    updateUser({ balance: (user?.balance ?? 0) - n });
    toast.success(`Withdrew $${n.toFixed(2)}`);
    setAmount("");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account, balance and history.</p>
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-2xl font-semibold text-primary">
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </span>
          <div className="flex-1">
            <p className="text-lg font-semibold">{user?.username}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
              {user?.role}
            </span>
          </div>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PencilLine className="mr-1.5 h-4 w-4" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Username</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button
                  onClick={() => {
                    updateUser({ username: name });
                    toast.success("Profile updated");
                    setEditOpen(false);
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Current Balance</p>
            <p className="mt-1 text-3xl font-semibold">${(user?.balance ?? 0).toFixed(2)}</p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Wallet className="h-6 w-6" />
          </span>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button onClick={onDeposit} className="sm:w-32">
            <Plus className="mr-1.5 h-4 w-4" />
            Deposit
          </Button>
          <Button onClick={onWithdraw} variant="outline" className="sm:w-32">
            <Minus className="mr-1.5 h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </section>

      <Link to="/history">
        <Button variant="outline" className="w-full sm:w-auto">
          <History className="mr-1.5 h-4 w-4" />
          View Transaction History
        </Button>
      </Link>
    </div>
  );
}
