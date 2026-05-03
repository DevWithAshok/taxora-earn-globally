import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Taxora" }] }),
  component: AuthPage,
});

const COUNTRIES = ["India", "Indonesia", "Philippines", "Vietnam", "Thailand", "Singapore", "Malaysia"];

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { login } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "India" });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    login({ name: form.name || form.email.split("@")[0], email: form.email, country: form.country });
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md rounded-2xl border border-border/60 bg-gradient-card p-8 shadow-elegant">
          <div className="flex rounded-lg bg-muted p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
                  mode === m ? "bg-background shadow-card" : "text-muted-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to your Taxora workspace." : "Start tracking global income in seconds."}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5" />
            </div>
            {mode === "signup" && (
              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            )}
            <Button type="submit" variant="hero" size="lg" className="w-full">
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
