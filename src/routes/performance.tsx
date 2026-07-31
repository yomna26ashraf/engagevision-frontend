import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Loader2 } from "lucide-react";
import { GlassCard, SectionHeading } from "@/components/site/Primitives";
import { PageHero, PageSection } from "@/components/site/PageShell";
import { fetchPerformance } from "@/lib/api";

export const Route = createFileRoute("/performance")({
  head: () => ({
    meta: [
      { title: "Model Performance — Accuracy, Loss & Confusion Matrix | EngageVision AI" },
      {
        name: "description",
        content:
          "Real training curves, confusion matrix, precision/recall/F1 for the M-LATTE engagement model, pulled directly from the last training run.",
      },
      { property: "og:title", content: "Model Performance — EngageVision AI" },
      {
        property: "og:description",
        content: "Full evaluation report sourced from checkpoints/results.json — no fixtures.",
      },
    ],
  }),
  component: Performance,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  color: "var(--foreground)",
} as const;

function Performance() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["performance"],
    queryFn: fetchPerformance,
  });

  const hasResults = !!data?.final_test && (data?.epochs.length ?? 0) > 0;

  return (
    <>
      <PageHero
        eyebrow="Evaluation"
        title={
          <>
            Benchmarked, <span className="text-gradient">not guessed</span>
          </>
        }
        description="Dual-branch ResNet-50 visual encoder + FFT trend/cycle VAE (M-LATTE), trained on DAiSEE. Numbers below come straight from the last training run — no fixtures."
      />

      {isError ? (
        <PageSection>
          <GlassCard className="flex items-start gap-3 p-6 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{error instanceof Error ? error.message : "Could not load performance data."}</span>
          </GlassCard>
        </PageSection>
      ) : null}

      {isLoading ? (
        <PageSection>
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> Loading results…
          </div>
        </PageSection>
      ) : null}

      {data && !hasResults && !isLoading ? (
        <PageSection>
          <GlassCard className="p-8 text-center">
            <p className="text-lg font-medium">No training run recorded yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Run <code className="font-mono">scripts/train_daisee.py</code> — it writes{" "}
              <code className="font-mono">checkpoints/results.json</code>, which this page reads
              automatically. Come back once it finishes.
            </p>
          </GlassCard>
        </PageSection>
      ) : null}

      {data && hasResults && data.final_test ? (
        <>
          <PageSection>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <GlassCard className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Accuracy</p>
                <p className="font-display mt-3 text-3xl font-semibold text-gradient">
                  {(data.final_test.accuracy * 100).toFixed(1)}%
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Paper reference: {(data.paper_reference_accuracy * 100).toFixed(2)}%
                </p>
              </GlassCard>
              <GlassCard className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Test MSE</p>
                <p className="font-display mt-3 text-3xl font-semibold text-gradient">
                  {data.final_test.mse.toFixed(4)}
                </p>
              </GlassCard>
              <GlassCard className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Test MAE</p>
                <p className="font-display mt-3 text-3xl font-semibold text-gradient">
                  {data.final_test.mae.toFixed(4)}
                </p>
              </GlassCard>
              <GlassCard className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Epochs run</p>
                <p className="font-display mt-3 text-3xl font-semibold text-gradient">
                  {data.epochs.length}
                </p>
              </GlassCard>
            </div>
          </PageSection>

          <PageSection>
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold">Validation accuracy curve</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nearest-level bucketed accuracy per epoch
                </p>
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.epochs}>
                      <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="epoch" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis domain={[0, 1]} stroke="var(--muted-foreground)" fontSize={12} width={40} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line
                        type="monotone"
                        dataKey="val_acc"
                        stroke="var(--violet)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold">MSE curve</h2>
                <p className="mt-2 text-sm text-muted-foreground">Train vs. validation regression loss</p>
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.epochs}>
                      <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="epoch" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} width={40} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line
                        type="monotone"
                        dataKey="train_mse"
                        stroke="var(--cyan)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="val_mse"
                        stroke="var(--warning)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </PageSection>

          {data.confusion_matrix ? (
            <PageSection>
              <SectionHeading
                eyebrow="Error analysis"
                title={
                  <>
                    Confusion <span className="text-gradient">matrix</span>
                  </>
                }
                description="Rows are ground truth, columns are predictions (nearest-level bucketing). Cell intensity scales with the share of that true class."
              />
              <GlassCard className="mt-10 overflow-x-auto p-6 sm:p-8">
                <table className="w-full min-w-[560px] border-separate border-spacing-1.5 text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-xs uppercase tracking-widest text-muted-foreground">
                        True \ Pred
                      </th>
                      {data.class_labels.map((c) => (
                        <th
                          key={c}
                          className="p-2 text-xs uppercase tracking-widest text-muted-foreground"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.confusion_matrix.map((row, i) => {
                      const rowTotal = row.reduce((a, b) => a + b, 0) || 1;
                      return (
                        <tr key={data.class_labels[i]}>
                          <th className="p-2 text-left text-xs font-medium text-muted-foreground">
                            {data.class_labels[i]}
                          </th>
                          {row.map((v, j) => {
                            const ratio = v / rowTotal;
                            return (
                              <td
                                key={j}
                                className="rounded-xl p-3 text-center font-mono text-sm transition-transform hover:scale-105"
                                style={{
                                  background: `color-mix(in oklab, var(--${i === j ? "brand" : "violet"}) ${Math.round(ratio * 90) + 6}%, transparent)`,
                                }}
                              >
                                {v}
                                <span className="block text-[10px] text-muted-foreground">
                                  {(ratio * 100).toFixed(1)}%
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </GlassCard>
            </PageSection>
          ) : null}

          {data.per_class_metrics ? (
            <PageSection>
              <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                <GlassCard className="p-6 sm:p-8">
                  <h2 className="text-xl font-semibold">Per-class metrics</h2>
                  <div className="mt-6 space-y-5">
                    {data.per_class_metrics.map((m) => (
                      <div key={m.name}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-medium">{m.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            P {m.precision.toFixed(3)} · R {m.recall.toFixed(3)} · F1{" "}
                            {m.f1.toFixed(3)}
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-gradient-brand transition-all duration-700"
                            style={{ width: `${m.f1 * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6 sm:p-8">
                  <h2 className="text-xl font-semibold">Precision vs. recall</h2>
                  <div className="mt-6 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.per_class_metrics}>
                        <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis domain={[0, 1]} stroke="var(--muted-foreground)" fontSize={12} width={40} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                        <Bar dataKey="precision" fill="var(--brand)" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="recall" fill="var(--violet)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </div>
            </PageSection>
          ) : null}
        </>
      ) : null}
    </>
  );
}
