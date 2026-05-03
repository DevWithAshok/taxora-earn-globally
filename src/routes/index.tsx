import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, FileText, Globe2, Sparkles, Wallet, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container mx-auto grid gap-12 px-6 py-20 lg:grid-cols-2 lg:py-32">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">Built for SEA creators</span>
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Earn globally. <br />
            <span className="text-gradient">Stay compliant</span> locally.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Taxora is the income, tax, and invoicing companion for freelancers across India, Indonesia, the Philippines, Vietnam and Thailand earning from international clients.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/auth">Start Free <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="#features">See features</a>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <div>✦ No credit card</div>
            <div>✦ 9+ currencies</div>
            <div>✦ AI categorization</div>
          </div>
        </div>
        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 bg-gradient-primary opacity-20 blur-3xl" />
      <div className="relative rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">This year</p>
            <p className="mt-1 font-display text-3xl font-bold">$24,820.00</p>
          </div>
          <div className="rounded-lg bg-success/10 px-2 py-1 text-xs font-medium text-success">+18.4%</div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Freelance", v: "$14.2k", c: "bg-primary" },
            { label: "Platform", v: "$6.8k", c: "bg-primary-glow" },
            { label: "Royalty", v: "$3.8k", c: "bg-accent-foreground" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border/40 bg-background/40 p-3">
              <div className={`h-1.5 w-8 rounded-full ${s.c}`} />
              <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold">{s.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2">
          {[
            { s: "Upwork", a: "$1,200", d: "Apr 12" },
            { s: "YouTube", a: "$480", d: "Apr 20" },
            { s: "Direct Client", a: "€2,150", d: "Apr 28" },
          ].map((t) => (
            <div key={t.s} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
              <span>{t.s}</span>
              <span className="text-muted-foreground">{t.d}</span>
              <span className="font-medium">{t.a}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between rounded-lg bg-gradient-primary p-4 text-primary-foreground">
          <div>
            <p className="text-xs opacity-80">Estimated tax (15%)</p>
            <p className="font-display text-xl font-bold">$3,723.00</p>
          </div>
          <BarChart3 className="h-8 w-8 opacity-80" />
        </div>
      </div>
    </div>
  );
}

function Features() {
  const items = [
    { icon: Wallet, t: "Multi-currency tracker", d: "Log income from 9+ currencies. Auto-converted to your home currency in real time." },
    { icon: Sparkles, t: "AI categorization", d: "Smart classification of freelance, royalty, and platform income for accurate reporting." },
    { icon: BarChart3, t: "Tax estimation", d: "See your projected annual tax liability based on your country's slab — instantly." },
    { icon: FileText, t: "Invoice generator", d: "Beautiful, downloadable invoices in seconds. Send and get paid faster." },
  ];
  return (
    <section id="features" className="container mx-auto px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">Features</p>
        <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Everything a global creator needs</h2>
        <p className="mt-4 text-muted-foreground">Replace 4 spreadsheets and 2 apps with one calm dashboard.</p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((f) => (
          <div key={f.t} className="group rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card transition hover:shadow-elegant hover:-translate-y-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <f.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Sign up free", d: "Create your account in 30 seconds. Pick your country for the right tax rules." },
    { n: "02", t: "Log your income", d: "Add transactions manually or paste from PayPal, Wise, Stripe. AI does the rest." },
    { n: "03", t: "Stay tax-ready", d: "See estimated taxes and export invoices when you need to file." },
  ];
  return (
    <section id="how" className="border-y border-border/50 bg-muted/30 py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">How it works</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Three steps to peace of mind</h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border/60 bg-card p-8">
              <div className="font-display text-5xl font-bold text-gradient">{s.n}</div>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", desc: "For getting started", features: ["Up to 20 transactions/mo", "Basic tax estimate", "1 invoice/mo"], cta: "Start Free", featured: false },
    { name: "Pro", price: "$9", desc: "For active creators", features: ["Unlimited transactions", "AI categorization", "Unlimited invoices", "Priority support"], cta: "Go Pro", featured: true },
    { name: "Premium", price: "$24", desc: "For agencies & teams", features: ["Everything in Pro", "Team seats", "CA-ready exports", "Custom tax rules"], cta: "Contact us", featured: false },
  ];
  return (
    <section id="pricing" className="container mx-auto px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">Pricing</p>
        <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Simple, creator-friendly</h2>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl border p-8 transition ${
              t.featured
                ? "border-primary/40 bg-gradient-card shadow-glow scale-[1.02]"
                : "border-border/60 bg-card shadow-card"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-xl font-semibold">{t.name}</h3>
              {t.featured && <span className="rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Popular</span>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <p className="mt-6 font-display text-5xl font-bold">{t.price}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
            <ul className="mt-6 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-full" variant={t.featured ? "hero" : "outline"} size="lg">
              <Link to="/auth">{t.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
            <Globe2 className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold">Taxora</span>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Taxora. Built with care for SEA creators.</p>
      </div>
    </footer>
  );
}
