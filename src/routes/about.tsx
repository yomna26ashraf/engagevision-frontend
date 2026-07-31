import { createFileRoute } from "@tanstack/react-router";
import { Brain, Eye, Layers3, Network, Repeat, Workflow } from "lucide-react";
import { GlassCard, SectionHeading } from "@/components/site/Primitives";
import { PageHero, PageSection } from "@/components/site/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dual-Branch ResNet-50, FFT Decomposition & VAE | EngageVision AI" },
      {
        name: "description",
        content:
          "How EngageVision AI works: a dual-branch ResNet-50 visual encoder, FFT-based trend/cycle decomposition, and a Transformer VAE (M-LATTE), trained on DAiSEE.",
      },
      { property: "og:title", content: "About the Technology — EngageVision AI" },
      {
        property: "og:description",
        content:
          "Plain-language explanations of the dual-branch encoder, FFT decomposition and VAE powering EngageVision AI.",
      },
    ],
  }),
  component: About,
});

const concepts = [
  {
    icon: Eye,
    title: "Dual-Branch Visual Encoder",
    body: "Every frame runs through two ResNet-50 backbones in parallel: one fine-tuned to read facial emotion (warmed up on FER2013), the other aimed at student behavior cues like screen-viewing, writing and distraction. Their 2048-d outputs are concatenated into a single 4096-d visual feature per frame.",
  },
  {
    icon: Repeat,
    title: "FFT Trend/Cycle Decomposition",
    body: "A clip's feature sequence is rarely one smooth signal — it's a slow-moving trend (gradually settling in or drifting off) overlaid with short periodic fluctuations (a glance away, a fidget). We use an FFT to split the sequence into exactly these two components before modeling them separately.",
  },
  {
    icon: Layers3,
    title: "Dual-Branch VAE",
    body: "The trend and cycle signals each get their own Variational Autoencoder branch: a 1D-convolutional stack feeds a Transformer encoder, which predicts a latent mean and variance. Sampling from that distribution (the reparameterization trick) gives a compact, noise-robust summary of how engagement is evolving.",
  },
  {
    icon: Network,
    title: "Transformer Encoder–Decoder",
    body: "Inside each VAE branch, a Transformer encoder captures how the signal relates across the whole clip window, and a matching decoder reconstructs it from the sampled latent — the reconstruction error is part of the training signal that keeps the latent space meaningful rather than collapsing.",
  },
  {
    icon: Brain,
    title: "Cross-Modal Fusion (ViCEF)",
    body: "When audio and transcript are available (not the case for DAiSEE, which is video-only), a cross-attention module lets the visual stream query audio and text for complementary cues — vision leads, sound and language fill in what a face alone can't tell you.",
  },
  {
    icon: Workflow,
    title: "Transfer Learning",
    body: "Training from scratch would need millions of labelled classroom clips. Instead, both ResNet-50 branches start from ImageNet weights; the emotion branch is further warmed up on FER2013. The behavior branch currently has no domain-specific pretraining data available, so it's left trainable to adapt directly on DAiSEE — a known gap, tracked on the Roadmap page.",
  },
];

const stack = [
  { k: "Visual backbone", v: "Dual ResNet-50 (emotion + behavior)" },
  { k: "Temporal model", v: "FFT decomposition + Transformer VAE" },
  { k: "Fusion (multimodal)", v: "ViCEF cross-attention (video+audio+text)" },
  { k: "Optimizer", v: "Adam · lr 1e-4" },
  { k: "Framework", v: "PyTorch 2 · FastAPI" },
  { k: "Output", v: "Continuous score → 4 engagement levels" },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About the technology"
        title={
          <>
            How a camera learns to read a <span className="text-gradient">classroom</span>
          </>
        }
        description="EngageVision AI (M-LATTE) stacks six well-understood ideas into one pipeline. Here is each of them, in plain language and in the order the data meets them."
      />

      <PageSection>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {concepts.map((c) => (
            <GlassCard key={c.title} className="group">
              <span className="grid size-11 place-items-center rounded-2xl bg-gradient-brand glow transition-transform duration-500 group-hover:scale-110">
                <c.icon className="size-5 text-primary-foreground" />
              </span>
              <h2 className="mt-5 text-lg font-semibold">{c.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </GlassCard>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading
          eyebrow="Under the hood"
          title={
            <>
              The production <span className="text-gradient">stack</span>
            </>
          }
        />
        <GlassCard className="mt-10 p-8">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stack.map((s) => (
              <div key={s.k} className="glass rounded-2xl p-5">
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">{s.k}</dt>
                <dd className="mt-2 text-sm font-medium">{s.v}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
      </PageSection>
    </>
  );
}
