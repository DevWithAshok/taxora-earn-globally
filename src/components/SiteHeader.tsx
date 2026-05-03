import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useStore } from "@/lib/store";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  const { user, logout } = useStore();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Taxora</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="text-sm text-muted-foreground transition hover:text-foreground">Features</a>
          <a href="/#how" className="text-sm text-muted-foreground transition hover:text-foreground">How it works</a>
          <a href="/#pricing" className="text-sm text-muted-foreground transition hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/dashboard">Dashboard</Link></Button>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/auth">Login</Link></Button>
              <Button asChild variant="hero" size="sm"><Link to="/auth">Start Free</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
