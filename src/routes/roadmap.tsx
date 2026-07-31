import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Gauge, Puzzle, UserCircle2 } from "lucide-react";
import { GlassCard } from "@/components/site/Primitives";
import { PageHero, PageSection } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — What's Next for EngageVision AI" },
      {
        name: "description",
        content:
          "What's built today and what's next: multi-face live detection, missing-modality robustness, fine-grained attention shifts, deployment efficiency and personalization.",
      },
      { property: "og:title", content: "Roadmap — EngageVision AI" },
      {
        property: "og:description",
        content: "An honest look at what's implemented today and what's planned next.",
      },
    ],
  }),
  component: Roadmap,
});

const planned = [
  {
    icon: Camera,
    title: "Multi-face live detection",
    body: "Real-time engagement overlays for every face in a camera feed. This needs a face-detection stage in front of M-LATTE (which today scores one learner's clip at a time) — planned as the next major addition.",
  },
  {
    icon: Puzzle,
    title: "Missing-modality robustness",
    body: "Today, a missing transcript falls back to a single global-mean embedding. Swapping this for modality dropout during training (or a learned imputation network) should make predictions more reliable when audio or text is partially unavailable.",
  },
  {
    icon: Gauge,
    title: "Fine-grained, short-term attention",
    body: "The trend/cycle decomposition captures gradual shifts and periodic patterns well; a local-attention branch over short sub-windows would add sensitivity to brief, fast attention lapses that don't show up as a clear cycle.",
  },
  {
    icon: UserCircle2,
    title: "Personalization",
    body: "Two students can show the same behavior for different reasons. Conditioning the regression head on a learned per-student embedding would let the model calibrate to individual baselines over repeated sessions.",
  },
];

function Roadmap() {
  return (
    <>
      <PageHero
        eyebrow="What's next"
        title={
          <>
            Built today, and what's <span className="text-gradient">coming next</span>
          </>
        }
        description="EngageVision AI runs a real, trained model today — a single-learner clip in, an engagement score out. Here's what's shipped, and what's deliberately still ahead."
      />

      <PageSection>
        <GlassCard className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Shipped today</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Upload a face-visible image or short clip on the{" "}
            <Link to="/demo" className="underline underline-offset-4">
              AI Demo
            </Link>{" "}
            page and get a real prediction from the trained M-LATTE pipeline — a dual-branch
            ResNet-50 visual encoder feeding an FFT trend/cycle decomposition and a Transformer
            VAE, trained on DAiSEE. Every number on the{" "}
            <Link to="/dashboard" className="underline underline-offset-4">
              Dashboard
            </Link>{" "}
            and{" "}
            <Link to="/performance" className="underline underline-offset-4">
              Model Performance
            </Link>{" "}
            pages comes from that real model — no fixtures.
          </p>
          <Button asChild variant="hero" className="mt-6">
            <Link to="/demo">Try the demo</Link>
          </Button>
        </GlassCard>
      </PageSection>

      <PageSection>
        <div className="grid gap-5 md:grid-cols-2">
          {planned.map((p) => (
            <GlassCard key={p.title} className="group">
              <span className="grid size-11 place-items-center rounded-2xl bg-gradient-brand glow transition-transform duration-500 group-hover:scale-110">
                <p.icon className="size-5 text-primary-foreground" />
              </span>
              <h2 className="mt-5 text-lg font-semibold">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </GlassCard>
          ))}
        </div>
      </PageSection>
    </>
  );
}
