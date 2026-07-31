import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { NAV_LINKS } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-brand glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <span className="font-display text-base font-semibold">
              EngageVision <span className="text-gradient">AI</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Engagement intelligence powered by a dual-branch ResNet-50 encoder and an FFT
            trend/cycle Transformer VAE (M-LATTE), trained on DAiSEE.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:justify-items-end">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EngageVision AI — research prototype for classroom engagement
        analytics.
      </div>
    </footer>
  );
}
