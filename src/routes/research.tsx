import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Target, GitBranch, BarChart3, Rocket, AlertTriangle } from "lucide-react";
import { GlassCard, SectionHeading } from "@/components/site/Primitives";
import { PageHero, PageSection } from "@/components/site/PageShell";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research — Methodology, Pipeline & Results | EngageVision AI" },
      {
        name: "description",
        content:
          "The research behind EngageVision AI: problem statement, objectives, methodology, model pipeline, quantitative results and future work.",
      },
      { property: "og:title", content: "Research — EngageVision AI" },
      {
        property: "og:description",
        content: "Problem, objectives, methodology, pipeline diagram, results and future work.",
      },
    ],
  }),
  component: Research,
});

const objectives = [
  "Reproduce M-LATTE — a published continuous engagement-scoring architecture — end-to-end, not just on paper.",
  "Fine-tune a dual-branch ResNet-50 backbone (facial emotion + student behavior) via transfer learning.",
  "Model temporal engagement dynamics with an FFT trend/cycle decomposition feeding a Transformer VAE.",
  "Support full multimodal fusion (vision + audio + text via cross-attention) for datasets that provide all three.",
  "Ship a working, honestly-documented demo — including where results fall short of the source paper, and why.",
];

const methodology = [
  {
    title: "Data preparation",
    body: "DAiSEE clips are extracted to 1 fps frame sequences; the four-point Engagement label is mapped to a continuous {0, 0.25, 0.5, 1.0} target, following the source paper's data processing.",
  },
  {
    title: "Feature extraction",
    body: "Two ResNet-50 branches run per frame: an emotion branch warm-started on FER2013 (65.1% validation accuracy), and a behavior branch left trainable end-to-end on DAiSEE — no domain-specific behavior-pretraining data was available, a known limitation tracked on the Roadmap page.",
  },
  {
    title: "Temporal modelling",
    body: "An FFT splits each clip window into a slow-moving trend and short periodic cycles. Each component is encoded by its own Transformer-based VAE branch (1D-conv stack → Transformer encoder → latent mean/variance → reparameterization → Transformer decoder for reconstruction).",
  },
  {
    title: "Optimisation",
    body: "Adam at 1e-4, mixed precision with gradient accumulation (fits a single 16GB consumer GPU), early stopping on validation MSE with a patience of 10 epochs.",
  },
];

const pipeline = [
  "Clip frames (1 fps)",
  "Dual ResNet-50 encoder",
  "FFT trend/cycle split",
  "Transformer VAE ×2",
  "Regression head",
  "Engagement score",
];

const results = [
  { label: "Test accuracy", value: "54.3%", note: "nearest-level bucketing; paper reports 61.37%" },
  { label: "Test MSE", value: "0.072", note: "continuous regression loss" },
  { label: "Test MAE", value: "0.245", note: "on a 0-1 engagement scale" },
  { label: "Emotion branch", value: "65.1%", note: "FER2013 validation accuracy" },
];

const future = [
  "Missing-modality robustness: replace global-mean imputation with modality dropout or a learned imputation network.",
  "Fine-grained, short-term attention shifts: a local-attention branch over short sub-windows, alongside the existing trend/cycle split.",
  "Real-time deployment efficiency: distill or swap the dual ResNet-50 encoder for a lighter backbone.",
  "Personalization: condition the regression head on a learned per-student embedding.",
];

function Research() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title={
          <>
            The science behind the <span className="text-gradient">signal</span>
          </>
        }
        description="EngageVision AI began as a question: can a camera tell a teacher what a room already feels? This is the full research trail from problem to results."
      />

      <PageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-8">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-primary" />
              <h2 className="text-2xl font-semibold">Problem</h2>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Engagement is the strongest behavioural predictor of learning outcomes, yet it is
              measured through end-of-term surveys — retrospective, self-reported and far too coarse
              to change anything. In hybrid and large-cohort teaching, an instructor cannot read 200
              faces at once, and attention loss goes undetected until grades reveal it. Existing
              automated approaches classify single frames, ignoring that disengagement is a temporal
              phenomenon.
            </p>
          </GlassCard>

          <GlassCard className="p-8">
            <div className="flex items-center gap-3">
              <Target className="size-5 text-primary" />
              <h2 className="text-2xl font-semibold">Objectives</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {objectives.map((o, i) => (
                <li key={o} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-gradient-brand font-mono text-[10px] text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0">{o}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading
          eyebrow="Methodology"
          title={
            <>
              Four stages of <span className="text-gradient">model design</span>
            </>
          }
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {methodology.map((m) => (
            <GlassCard key={m.title}>
              <FlaskConical className="size-5 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
            </GlassCard>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <GlassCard className="p-8">
          <div className="flex items-center gap-3">
            <GitBranch className="size-5 text-primary" />
            <h2 className="text-2xl font-semibold">Pipeline</h2>
          </div>
          <div className="mt-8 flex flex-wrap items-stretch gap-3">
            {pipeline.map((p, i) => (
              <div key={p} className="flex items-center gap-3">
                <div className="glass rounded-2xl px-4 py-3 text-center text-sm transition-transform hover:scale-105">
                  <span className="block font-mono text-[10px] text-muted-foreground">
                    stage {i + 1}
                  </span>
                  {p}
                </div>
                {i < pipeline.length - 1 ? (
                  <span className="hidden h-px w-6 bg-gradient-brand sm:block" />
                ) : null}
              </div>
            ))}
          </div>
        </GlassCard>
      </PageSection>

      <PageSection>
        <SectionHeading
          eyebrow="Results"
          title={
            <>
              What the numbers <span className="text-gradient">showed</span>
            </>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((r) => (
            <GlassCard key={r.label} className="p-6">
              <BarChart3 className="size-5 text-primary" />
              <p className="font-display mt-4 text-3xl font-semibold text-gradient">{r.value}</p>
              <p className="mt-1 text-sm font-medium">{r.label}</p>
              <p className="mt-2 text-xs text-muted-foreground">{r.note}</p>
            </GlassCard>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <GlassCard className="p-8">
          <div className="flex items-center gap-3">
            <Rocket className="size-5 text-primary" />
            <h2 className="text-2xl font-semibold">Future work</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {future.map((f) => (
              <div key={f} className="glass rounded-2xl p-5 text-sm text-muted-foreground">
                {f}
              </div>
            ))}
          </div>
        </GlassCard>
      </PageSection>
    </>
  );
}
