import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AlertTriangle, ImageUp, Loader2, RefreshCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/site/Primitives";
import { PageHero, PageSection } from "@/components/site/PageShell";
import { ApiError, predictEngagement, type PredictionResponse } from "@/lib/api";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "AI Demo — Upload & Classify Engagement | EngageVision AI" },
      {
        name: "description",
        content:
          "Upload a classroom image or short clip and get a real engagement prediction from the M-LATTE model, with confidence and level breakdown.",
      },
      { property: "og:title", content: "AI Demo — EngageVision AI" },
      {
        property: "og:description",
        content: "Interactive engagement prediction demo backed by a real trained model.",
      },
    ],
  }),
  component: Demo,
});

function Demo() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f?: File) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(f);
  };

  const run = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const prediction = await predictEngagement(file);
      setResult(prediction);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong running the prediction.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <PageHero
        eyebrow="Inference playground"
        title={
          <>
            Upload a frame or clip, get an <span className="text-gradient">engagement verdict</span>
          </>
        }
        description="Runs the real M-LATTE pipeline (dual-branch visual encoder + trend/cycle VAE) trained on DAiSEE. A single image duplicates that frame across the model's 10-second window — upload a short clip for a temporally-aware prediction."
      />

      <PageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold">1 · Input image or clip</h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className="mt-6 grid min-h-[19rem] place-items-center rounded-3xl border border-dashed border-border bg-secondary/30 p-6 text-center transition-colors hover:border-primary/50"
            >
              {preview ? (
                file?.type.startsWith("video/") ? (
                  <video src={preview} controls className="max-h-72 w-auto rounded-2xl" />
                ) : (
                  <img
                    src={preview}
                    alt="Uploaded classroom frame for engagement analysis"
                    className="max-h-72 w-auto rounded-2xl object-contain"
                  />
                )
              ) : (
                <div>
                  <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-brand glow">
                    <ImageUp className="size-6 text-primary-foreground" />
                  </span>
                  <p className="mt-5 text-sm font-medium">Drop an image or short video here</p>
                  <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or MP4/AVI · face visible</p>
                </div>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="glass" size="lg" onClick={() => inputRef.current?.click()}>
                Choose file
              </Button>
              <Button variant="hero" size="lg" onClick={run} disabled={!file || loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {loading ? "Analysing…" : "Run prediction"}
              </Button>
              {preview ? (
                <Button variant="ghost" size="lg" onClick={reset}>
                  <RefreshCcw /> Reset
                </Button>
              ) : null}
            </div>
            {file ? <p className="mt-4 font-mono text-xs text-muted-foreground">{file.name}</p> : null}
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold">2 · Prediction</h2>

            {!result && !loading && !error ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Results appear here once inference completes.
              </p>
            ) : null}

            {error ? (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            {loading ? (
              <div className="mt-8 space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded-2xl bg-secondary/60" />
                ))}
              </div>
            ) : null}

            {result ? (
              <div className="animate-rise mt-6">
                {result.model_status === "untrained_demo" ? (
                  <div className="mb-4 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      Backend is running with an untrained model (no checkpoint found yet) — this
                      score is not meaningful. Train the model and restart the backend to see real
                      predictions.
                    </span>
                  </div>
                ) : null}

                <div className="glass rounded-3xl p-6 text-center">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Engagement level
                  </p>
                  <p className="font-display mt-2 text-4xl font-semibold text-gradient">
                    {result.engagement_level}
                  </p>
                  <p className="mt-3 font-mono text-sm text-muted-foreground">
                    score {result.engagement_score.toFixed(3)} · confidence{" "}
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-brand transition-all duration-1000"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Level breakdown (distance-weighted, not a calibrated classifier)
                  </p>
                  {result.level_probabilities.map((p) => (
                    <div key={p.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{p.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {(p.p * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-brand transition-all duration-1000"
                          style={{ width: `${p.p * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs text-muted-foreground">
                  {result.num_frames_used} frame(s) used for this prediction.
                </p>
              </div>
            ) : null}
          </GlassCard>
        </div>
      </PageSection>
    </>
  );
}
