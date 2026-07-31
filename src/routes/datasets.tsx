import { createFileRoute } from "@tanstack/react-router";
import { Database, Download, Layers, Users } from "lucide-react";
import { GlassCard } from "@/components/site/Primitives";
import { PageHero, PageSection } from "@/components/site/PageShell";

export const Route = createFileRoute("/datasets")({
  head: () => ({
    meta: [
      { title: "Datasets — DAiSEE & FER2013 | EngageVision AI" },
      {
        name: "description",
        content:
          "The two datasets behind EngageVision AI: DAiSEE for engagement training, FER2013 for the emotion branch's transfer-learning warm-up.",
      },
      { property: "og:title", content: "Training Datasets — EngageVision AI" },
      {
        property: "og:description",
        content: "DAiSEE and FER2013 dataset cards used to train the engagement model.",
      },
    ],
  }),
  component: Datasets,
});

const datasets = [
  {
    name: "DAiSEE",
    tag: "Primary",
    samples: "8,232 clips extracted",
    subjects: "112 learners",
    classes: ["Not engaged", "Barely engaged", "Engaged", "Highly engaged"],
    body: "In-the-wild e-learning recordings, originally labeled with four affective states on a four-point scale. We use the Engagement dimension, mapped to a continuous 0-1 score for training.",
    split: [60, 19, 21],
  },
  {
    name: "FER2013",
    tag: "Pretraining",
    samples: "35,887 images",
    subjects: "Crowd-sourced",
    classes: ["Happy", "Neutral", "Surprise", "Sad", "Angry", "Fear", "Disgust"],
    body: "48×48 grayscale facial expression corpus used to warm up the emotion branch of the dual-branch ResNet-50 visual encoder before end-to-end training on DAiSEE.",
    split: [80, 10, 10],
  },
];

const pipeline = [
  "Extract frames at 1 fps per clip (DAiSEE clips are already face-centered; no separate detection/alignment step is used today)",
  "Resize to 224×224 + ImageNet mean/std normalization",
  "Training-time augmentation: random horizontal flip (p=0.3), color jitter (brightness/contrast ±0.2)",
  "Pad or uniformly subsample each clip to a fixed frame count per window",
];

function Datasets() {
  return (
    <>
      <PageHero
        eyebrow="Data foundation"
        title={
          <>
            Two datasets, one <span className="text-gradient">engagement signal</span>
          </>
        }
        description="EngageVision AI trains its main model on DAiSEE, with FER2013 used only to warm up the emotion branch before end-to-end fine-tuning."
      />

      <PageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          {datasets.map((d) => (
            <GlassCard key={d.name} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand glow">
                  <Database className="size-5 text-primary-foreground" />
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {d.tag}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold">{d.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.body}</p>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="glass rounded-2xl px-4 py-3">
                  <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Layers className="size-3.5" /> Samples
                  </dt>
                  <dd className="mt-1 font-medium">{d.samples}</dd>
                </div>
                <div className="glass rounded-2xl px-4 py-3">
                  <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="size-3.5" /> Subjects
                  </dt>
                  <dd className="mt-1 font-medium">{d.subjects}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Labels</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.classes.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-primary/12 px-3 py-1 text-xs text-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-7">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Train / Val / Test
                </p>
                <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-secondary">
                  <span style={{ width: `${d.split[0]}%`, background: "var(--brand)" }} />
                  <span style={{ width: `${d.split[1]}%`, background: "var(--violet)" }} />
                  <span style={{ width: `${d.split[2]}%`, background: "var(--cyan)" }} />
                </div>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {d.split[0]}% / {d.split[1]}% / {d.split[2]}%
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <GlassCard className="p-8">
          <div className="flex items-center gap-3">
            <Download className="size-5 text-primary" />
            <h2 className="text-xl font-semibold sm:text-2xl">Preprocessing pipeline</h2>
          </div>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {pipeline.map((step, i) => (
              <li key={step} className="glass flex items-start gap-4 rounded-2xl p-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-brand font-mono text-xs text-primary-foreground">
                  {i + 1}
                </span>
                <span className="min-w-0 text-sm text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </GlassCard>
      </PageSection>
    </>
  );
}
