import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/site/Primitives";
import { PageHero, PageSection } from "@/components/site/PageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Request a Pilot | EngageVision AI" },
      {
        name: "description",
        content:
          "Talk to the EngageVision AI team about classroom pilots, dataset access or research collaboration.",
      },
      { property: "og:title", content: "Contact — EngageVision AI" },
      {
        property: "og:description",
        content: "Request a pilot, dataset access or a research collaboration with EngageVision AI.",
      },
    ],
  }),
  component: Contact,
});

const details = [
  { icon: Mail, label: "Email", value: "research@engagevision.ai" },
  { icon: MessageSquare, label: "Response time", value: "Within 2 working days" },
  { icon: MapPin, label: "Lab", value: "Vision & Learning Analytics Lab" },
];

const topics = ["Classroom pilot", "Dataset access", "Research collaboration", "Something else"];

function Contact() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(topics[0]);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let's put engagement data in your <span className="text-gradient">classroom</span>
          </>
        }
        description="Whether you want a pilot, the evaluation protocol or a co-authored paper, tell us what you're working on."
      />

      <PageSection>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <GlassCard className="p-6 sm:p-9">
            {sent ? (
              <div className="animate-rise grid min-h-[24rem] place-items-center text-center">
                <div>
                  <CheckCircle2 className="mx-auto size-12 text-success" />
                  <h2 className="mt-6 text-2xl font-semibold">Message received</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Thanks — we'll get back to you within two working days.
                  </p>
                  <Button className="mt-8" variant="glass" size="lg" onClick={() => setSent(false)}>
                    Send another
                  </Button>
                </div>
              </div>
            ) : (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Topic</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTopic(t)}
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          topic === t
                            ? "bg-gradient-brand text-primary-foreground glow"
                            : "glass text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" required placeholder="Ada Lovelace" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="ada@university.edu"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org">Institution</Label>
                  <Input id="org" placeholder="Department, university or company" className="h-11 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    placeholder="Tell us about your cohort size, teaching format and what you'd like to measure."
                    className="rounded-2xl"
                  />
                </div>

                <Button type="submit" variant="hero" size="xl" className="w-full rounded-2xl">
                  <Send /> Send message
                </Button>
              </form>
            )}
          </GlassCard>

          <div className="space-y-5">
            {details.map((d) => (
              <GlassCard key={d.label} className="p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-brand glow">
                  <d.icon className="size-4 text-primary-foreground" />
                </span>
                <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                  {d.label}
                </p>
                <p className="mt-1 text-sm font-medium break-words">{d.value}</p>
              </GlassCard>
            ))}
            <GlassCard glow className="p-6">
              <h2 className="text-lg font-semibold">Pilot programme</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We onboard a small number of institutions each term with full model evaluation
                support and anonymised analytics reporting.
              </p>
            </GlassCard>
          </div>
        </div>
      </PageSection>
    </>
  );
}
