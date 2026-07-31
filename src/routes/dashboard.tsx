import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Eye, Gauge, Loader2, Zap } from "lucide-react";
import { GlassCard } from "@/components/site/Primitives";
import { PageHero, PageSection } from "@/components/site/PageShell";
import { fetchDashboard } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Analytics Dashboard — Classroom Engagement KPIs | EngageVision AI" },
      {
        name: "description",
        content:
          "Live engagement KPIs, score distribution and prediction history, sourced directly from the M-LATTE backend.",
      },
      { property: "og:title", content: "Analytics Dashboard — EngageVision AI" },
      {
        property: "og:description",
        content: "KPIs, distribution chart and prediction history, backed by real inference logs.",
      },
    ],
  }),
  component: Dashboard,
});

const DIST_COLORS: Record<string, string> = {
  "Not Engaged": "var(--warning)",
  "Barely Engaged": "var(--violet)",
  Engaged: "var(--cyan)",
  "Highly Engaged": "var(--brand)",
};

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  color: "var(--foreground)",
} as const;

function Dashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(50),
    refetchInterval: 15_000,
  });

  return (
    <>
      <PageHero
        eyebrow="Analytics workspace"
        title={
          <>
            Classroom intelligence, <span className="text-gradient">at a glance</span>
          </>
        }
        description="Every prediction made through the demo or live pipeline rolls up into this dashboard in real time — no fixtures, no mock data."
      />

      {isError ? (
        <PageSection>
          <GlassCard className="flex items-start gap-3 p-6 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{error instanceof Error ? error.message : "Could not load dashboard data."}</span>
          </GlassCard>
        </PageSection>
      ) : null}

      {isLoading ? (
        <PageSection>
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> Loading dashboard…
          </div>
        </PageSection>
      ) : null}

      {data ? (
        <>
          {data.model_status === "untrained_demo" ? (
            <PageSection>
              <GlassCard className="flex items-start gap-3 p-4 text-xs text-warning">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  Backend model is untrained (no checkpoint yet). Numbers below reflect real
                  requests, but predictions themselves aren't meaningful until training finishes.
                </span>
              </GlassCard>
            </PageSection>
          ) : null}

          <PageSection>
            <div className="grid gap-4 sm:grid-cols-3">
              <GlassCard className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-brand glow">
                    <Zap className="size-4 text-primary-foreground" />
                  </span>
                </div>
                <p className="font-display mt-5 text-3xl font-semibold">
                  {data.avg_engagement_score !== null ? data.avg_engagement_score.toFixed(3) : "—"}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  Avg engagement score
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-brand glow">
                    <Eye className="size-4 text-primary-foreground" />
                  </span>
                </div>
                <p className="font-display mt-5 text-3xl font-semibold">{data.total_predictions}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  Predictions logged
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-brand glow">
                    <Gauge className="size-4 text-primary-foreground" />
                  </span>
                </div>
                <p className="font-display mt-5 text-3xl font-semibold capitalize">
                  {data.model_status.replace("_", " ")}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  Model status
                </p>
              </GlassCard>
            </div>
          </PageSection>

          <PageSection>
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold">Recent prediction scores</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Most recent {data.history.length} prediction(s), oldest to newest
                </p>
                <div className="mt-6 h-80">
                  {data.history.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[...data.history].reverse()}>
                        <defs>
                          <linearGradient id="dScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.7} />
                            <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="id" stroke="var(--muted-foreground)" fontSize={10} hide />
                        <YAxis
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          width={36}
                          domain={[0, 1]}
                        />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="var(--brand)"
                          strokeWidth={2}
                          fill="url(#dScore)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-muted-foreground">
                      No predictions yet — run the demo to see data here.
                    </div>
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold">Level distribution</h2>
                <p className="mt-2 text-sm text-muted-foreground">All logged predictions</p>
                <div className="mt-2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.distribution}
                        dataKey="count"
                        nameKey="label"
                        innerRadius="58%"
                        outerRadius="85%"
                        paddingAngle={3}
                        stroke="none"
                      >
                        {data.distribution.map((d) => (
                          <Cell key={d.label} fill={DIST_COLORS[d.label] ?? "var(--brand)"} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {data.distribution.map((d) => (
                    <li key={d.label} className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ background: DIST_COLORS[d.label] ?? "var(--brand)" }}
                        />
                        <span className="truncate">{d.label}</span>
                      </span>
                      <span className="font-mono text-xs">{d.count}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </PageSection>

          <PageSection>
            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">Prediction history</h2>
              <div className="mt-6 overflow-x-auto">
                {data.history.length > 0 ? (
                  <table className="w-full min-w-[620px] text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">ID</th>
                        <th className="pb-3 pr-4 font-medium">File</th>
                        <th className="pb-3 pr-4 font-medium">Prediction</th>
                        <th className="pb-3 pr-4 font-medium">Confidence</th>
                        <th className="pb-3 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.history.map((h) => (
                        <tr
                          key={h.id}
                          className="border-t border-border transition-colors hover:bg-primary/5"
                        >
                          <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{h.id}</td>
                          <td className="py-3 pr-4">{h.filename}</td>
                          <td className="py-3 pr-4">
                            <span className="rounded-full bg-primary/12 px-3 py-1 text-xs">
                              {h.label}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                                <div
                                  className="h-full rounded-full bg-gradient-brand"
                                  style={{ width: `${h.confidence * 100}%` }}
                                />
                              </div>
                              <span className="font-mono text-xs text-muted-foreground">
                                {(h.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 font-mono text-xs text-muted-foreground">
                            {new Date(h.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No predictions logged yet — try the AI Demo page first.
                  </p>
                )}
              </div>
            </GlassCard>
          </PageSection>
        </>
      ) : null}
    </>
  );
}
