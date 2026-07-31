import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BrainCircuit,
  Camera,
  Gauge,
  LineChart as LineChartIcon,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { GlassCard, SectionHeading, Eyebrow, StatPill } from "@/components/site/Primitives";
import { PageSection } from "@/components/site/PageShell";
import heroImage from "@/assets/hero-classroom.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EngageVision AI — Real-Time Classroom Engagement Intelligence" },
      {
        name: "description",
        content:
          "Measure attention and engagement across every learner with EngageVision AI: a dual-branch ResNet-50 visual encoder and FFT trend/cycle VAE (M-LATTE), trained on DAiSEE.",
      },
      { property: "og:title", content: "EngageVision AI — Real-Time Classroom Engagement Intelligence" },
      {
        property: "og:description",
        content:
          "Measure attention and engagement across every learner with EngageVision AI: a dual-branch ResNet-50 visual encoder and FFT trend/cycle VAE (M-LATTE), trained on DAiSEE.",
      },
    ],
  }),
  component: Home,
});

const engagementTrend = [
  { t: "Clip 1", engaged: 0.62 },
  { t: "Clip 2", engaged: 0.71 },
  { t: "Clip 3", engaged: 0.78 },
  { t: "Clip 4", engaged: 0.69 },
  { t: "Clip 5", engaged: 0.84 },
  { t: "Clip 6", engaged: 0.91 },
];

const features = [
  {
    icon: Camera,
    title: "Dual-branch visual encoder",
    body: "Two ResNet-50 backbones read each frame in parallel — one tuned for facial emotion, one for behavior cues like screen-viewing and distraction — and their features are fused into one rich per-frame representation.",
  },
  {
    icon: BrainCircuit,
    title: "FFT trend/cycle VAE",
    body: "A clip's signal is split via FFT into a slow-moving trend and short periodic cycles, each modeled by its own Transformer-based VAE branch — the core of the M-LATTE architecture.",
  },
  {
    icon: LineChartIcon,
    title: "Analytics that teach",
    body: "Session heatmaps, timelines and distribution views turn raw predictions into actionable classroom insight.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first pipeline",
    body: "On-device inference with anonymised identifiers — frames never need to leave the classroom network.",
  },
  {
    icon: Timer,
    title: "Trained end-to-end",
    body: "Adam optimizer, mixed precision, gradient accumulation — tuned to fit comfortably on a single consumer GPU.",
  },
  {
    icon: Gauge,
    title: "54.3% test accuracy",
    body: "Measured on the DAiSEE test split (nearest-level bucketing of the continuous score); see the full breakdown on Model Performance.",
  },
];

function Home() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-rise">
            <Eyebrow>Engagement intelligence platform</Eyebrow>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.03] sm:text-6xl lg:text-[4.25rem]">
              See how every learner truly <span className="text-gradient">engages</span>.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              EngageVision AI reads facial affect and behavior cues from a short clip, turning it
              into a continuous, explainable engagement score — trained end-to-end on the DAiSEE
              dataset.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl" className="rounded-2xl">
                <Link to="/demo">
                  <Sparkles /> Run the AI demo
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl" className="rounded-2xl">
                <Link to="/dashboard">Explore dashboard</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatPill label="Test accuracy" value="54.3%" />
              <StatPill label="Test MAE" value="0.245" />
              <StatPill label="Dataset" value="DAiSEE" />
              <StatPill label="Classes" value="4" />
            </div>
          </div>

          <div className="animate-rise relative">
            <div className="glass relative overflow-hidden rounded-[2rem] p-2">
              <img
                src={heroImage}
                alt="Classroom scene used to illustrate the engagement-detection demo"
                width={1536}
                height={1024}
                className="h-auto w-full rounded-[1.6rem] object-cover"
              />
              <div className="animate-scan pointer-events-none absolute inset-x-2 top-1/2 h-24 bg-gradient-to-b from-transparent via-cyan/30 to-transparent" />
            </div>
            <div className="animate-float glass absolute -bottom-6 -left-4 hidden rounded-2xl px-4 py-3 sm:block">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Sample prediction</p>
              <p className="font-display text-lg font-semibold text-gradient">Highly Engaged · 0.91</p>
            </div>
            <div className="animate-float-slow glass absolute -right-3 -top-5 hidden rounded-2xl px-4 py-3 sm:block">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Confidence</p>
              <p className="font-display text-lg font-semibold text-gradient">0.94</p>
            </div>
          </div>
        </div>
      </section>

      <PageSection>
        <GlassCard className="p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold sm:text-2xl">Sample engagement score trend</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Illustrative shape of the model's continuous output — see real, live numbers on
                the Dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <Legend color="var(--brand)" label="Engagement score" />
            </div>
          </div>
          <div className="mt-8 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementTrend}>
                <defs>
                  <linearGradient id="gEngaged" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis domain={[0, 1]} stroke="var(--muted-foreground)" fontSize={12} width={32} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    color: "var(--foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="engaged"
                  stroke="var(--brand)"
                  fill="url(#gEngaged)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </PageSection>

      <PageSection>
        <SectionHeading
          eyebrow="Capabilities"
          title={
            <>
              A full engagement stack, <span className="text-gradient">end to end</span>
            </>
          }
          description="From raw frames to classroom decisions — detection, temporal modelling, analytics and reporting in one system."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <GlassCard key={f.title} className="group">
              <span className="grid size-11 place-items-center rounded-2xl bg-gradient-brand glow transition-transform duration-500 group-hover:scale-110">
                <f.icon className="size-5 text-primary-foreground" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </GlassCard>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <GlassCard glow className="overflow-hidden p-10 text-center sm:p-16">
          <Activity className="mx-auto size-8 text-primary" />
          <h2 className="mt-6 text-balance text-3xl font-semibold sm:text-4xl">
            Bring measurable attention to every lecture
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Upload a frame or clip and get a real prediction, or explore the analytics workspace
            built on the DAiSEE engagement dataset.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="lg" className="rounded-2xl">
              <Link to="/demo">Try the demo</Link>
            </Button>
            <Button asChild variant="glass" size="lg" className="rounded-2xl">
              <Link to="/research">Read the research</Link>
            </Button>
          </div>
        </GlassCard>
      </PageSection>
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
