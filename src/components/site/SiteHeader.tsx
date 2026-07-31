import { Link } from "@tanstack/react-router";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/demo", label: "AI Demo" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/datasets", label: "Datasets" },
  { to: "/performance", label: "Model Performance" },
  { to: "/research", label: "Research" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-x-0 border-t-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-brand glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <span className="font-display truncate text-base font-semibold tracking-tight">
              EngageVision <span className="text-gradient">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-foreground bg-primary/15" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="rounded-full px-3 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 justify-self-end">
            <Button asChild variant="hero" size="sm" className="hidden rounded-full sm:inline-flex">
              <Link to="/demo">Try the model</Link>
            </Button>
            <Button
              variant="glass"
              size="icon"
              className="rounded-full xl:hidden"
              aria-label="Toggle navigation"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {open ? (
          <div className="animate-rise border-t border-border px-4 pb-5 pt-3 xl:hidden">
            <nav className="grid gap-1 sm:grid-cols-2">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: l.to === "/" }}
                  activeProps={{ className: "bg-primary/15 text-foreground" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-primary/10"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
