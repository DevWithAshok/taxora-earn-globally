import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useStore, toUSD, type Transaction } from "@/lib/store";
import {
  LayoutDashboard, Receipt, FileText, LogOut, Sparkles, Plus, TrendingUp, Wallet, Calculator, Download,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Taxora" }] }),
  component: Dashboard,
});

type Tab = "overview" | "transactions" | "invoices";

function Dashboard() {
  const { user, transactions, invoices, addTransaction, addInvoice, logout } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
  }, [user, navigate]);

  const totalUSD = useMemo(
    () => transactions.reduce((s, t) => s + toUSD(t.amount, t.currency), 0),
    [transactions],
  );
  const taxRate = 0.15;
  const estimatedTax = totalUSD * taxRate;

  const byCategory = useMemo(() => {
    const m: Record<string, number> = { Freelance: 0, Platform: 0, Royalty: 0 };
    transactions.forEach((t) => (m[t.category] += toUSD(t.amount, t.currency)));
    return m;
  }, [transactions]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border/60 bg-sidebar p-4 lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Taxora</span>
        </Link>
        <nav className="space-y-1">
          {[
            { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
            { id: "transactions" as const, label: "Transactions", icon: Receipt },
            { id: "invoices" as const, label: "Invoices", icon: FileText },
          ].map((i) => (
            <button
              key={i.id}
              onClick={() => setTab(i.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                tab === i.id
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <i.icon className="h-4 w-4" />
              {i.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.country}</p>
          <Button variant="ghost" size="sm" onClick={logout} className="mt-3 w-full justify-start">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background/70 px-6 backdrop-blur-xl">
          <div>
            <h1 className="font-display text-xl font-semibold capitalize">{tab}</h1>
            <p className="text-xs text-muted-foreground">Welcome back, {user.name.split(" ")[0]} 👋</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="container mx-auto max-w-6xl px-6 py-8">
          {tab === "overview" && (
            <Overview totalUSD={totalUSD} estimatedTax={estimatedTax} byCategory={byCategory} transactions={transactions} />
          )}
          {tab === "transactions" && <TransactionsTab transactions={transactions} onAdd={addTransaction} />}
          {tab === "invoices" && <InvoicesTab invoices={invoices} onAdd={addInvoice} />}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: typeof Wallet; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 shadow-card ${accent ? "border-primary/30 bg-gradient-primary text-primary-foreground" : "border-border/60 bg-card"}`}>
      <div className="flex items-center justify-between">
        <p className={`text-xs uppercase tracking-wider ${accent ? "opacity-80" : "text-muted-foreground"}`}>{label}</p>
        <Icon className="h-4 w-4 opacity-80" />
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      {sub && <p className={`mt-1 text-xs ${accent ? "opacity-80" : "text-muted-foreground"}`}>{sub}</p>}
    </div>
  );
}

function Overview({ totalUSD, estimatedTax, byCategory, transactions }: { totalUSD: number; estimatedTax: number; byCategory: Record<string, number>; transactions: Transaction[] }) {
  const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const total = Math.max(1, totalUSD);
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Wallet} label="Total income" value={fmt(totalUSD)} sub="All currencies, USD equivalent" />
        <StatCard icon={Calculator} label="Estimated tax (15%)" value={fmt(estimatedTax)} sub="Based on your country slab" accent />
        <StatCard icon={TrendingUp} label="Transactions" value={String(transactions.length)} sub="Tracked this period" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">AI Income Breakdown</h3>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">AI</span>
          </div>
          <p className="text-sm text-muted-foreground">Auto-classified by source</p>
          <div className="mt-6 space-y-4">
            {Object.entries(byCategory).map(([cat, val]) => {
              const pct = (val / total) * 100;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cat}</span>
                    <span className="text-muted-foreground">{fmt(val)} · {pct.toFixed(0)}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold">Recent activity</h3>
          <ul className="mt-4 space-y-3">
            {transactions.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{t.source}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </div>
                <p className="font-mono text-sm">{t.currency} {t.amount.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "IDR", "PHP", "VND", "THB", "SGD"];

function TransactionsTab({ transactions, onAdd }: { transactions: Transaction[]; onAdd: (t: { amount: number; currency: string; source: string; date: string }) => void }) {
  const [form, setForm] = useState({ amount: "", currency: "USD", source: "", date: new Date().toISOString().slice(0, 10) });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onAdd({ amount: parseFloat(form.amount), currency: form.currency, source: form.source, date: form.date });
    setForm({ amount: "", currency: "USD", source: "", date: new Date().toISOString().slice(0, 10) });
  };
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={submit} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card lg:col-span-1">
        <h3 className="font-display text-lg font-semibold">Add transaction</h3>
        <p className="text-sm text-muted-foreground">AI will categorize it for you.</p>
        <div className="mt-4 space-y-3">
          <div>
            <Label>Source</Label>
            <Input required placeholder="Upwork, YouTube..." value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Amount</Label>
              <Input required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Currency</Label>
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label>Date</Label>
            <Input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1.5" />
          </div>
          <Button type="submit" variant="hero" className="w-full"><Plus className="h-4 w-4" /> Add</Button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card lg:col-span-2">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Source</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-border/50">
                <td className="px-5 py-3 font-medium">{t.source}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{t.category}</span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{t.date}</td>
                <td className="px-5 py-3 text-right font-mono">{t.currency} {t.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoicesTab({ invoices, onAdd }: { invoices: { id: string; client: string; amount: number; currency: string; date: string }[]; onAdd: (i: { client: string; amount: number; currency: string; date: string }) => void }) {
  const [form, setForm] = useState({ client: "", amount: "", currency: "USD", date: new Date().toISOString().slice(0, 10) });
  const [preview, setPreview] = useState<typeof invoices[number] | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const inv = { client: form.client, amount: parseFloat(form.amount), currency: form.currency, date: form.date };
    onAdd(inv);
    setPreview({ ...inv, id: "preview" });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={submit} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold">Create invoice</h3>
        <div className="mt-4 space-y-3">
          <div>
            <Label>Client name</Label>
            <Input required value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Amount</Label>
              <Input required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Currency</Label>
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label>Date</Label>
            <Input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1.5" />
          </div>
          <Button type="submit" variant="hero" className="w-full">Generate invoice</Button>
        </div>

        {invoices.length > 0 && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Recent invoices</p>
            <ul className="mt-2 space-y-1 text-sm">
              {invoices.slice(0, 5).map((i) => (
                <li key={i.id} className="flex justify-between rounded-md bg-muted/50 px-3 py-2">
                  <span>{i.client}</span><span className="font-mono">{i.currency} {i.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      <div className="rounded-2xl border border-border/60 bg-gradient-card p-8 shadow-elegant">
        {preview ? (
          <>
            <div className="flex items-start justify-between border-b border-border/60 pb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Invoice</p>
                <p className="font-display text-2xl font-bold text-gradient">Taxora</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>#{Math.floor(Math.random() * 9000 + 1000)}</p>
                <p>{preview.date}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Billed to</p>
              <p className="font-display text-xl font-semibold">{preview.client}</p>
            </div>
            <div className="mt-8 flex items-end justify-between rounded-xl bg-gradient-primary p-6 text-primary-foreground">
              <div>
                <p className="text-xs opacity-80">Amount due</p>
                <p className="font-display text-3xl font-bold">{preview.currency} {preview.amount.toLocaleString()}</p>
              </div>
              <Button variant="soft" size="sm" onClick={() => window.print()}><Download className="h-4 w-4" /> Download</Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">Thank you for your business. Payment due within 14 days.</p>
          </>
        ) : (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
            <FileText className="h-10 w-10 opacity-40" />
            <p className="mt-3 text-sm">Your invoice preview will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
