import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Kisawan" },
      { name: "description", content: "Kisawan unites Kisan and Sawan — protecting farmers, fields, and climate with AI." },
    ],
  }),
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">About</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">A name that means farmer and rain.</h1>
      <p className="mt-5 text-lg text-muted-foreground">
        <span className="text-foreground">Kisawan</span> blends <span className="text-foreground">Kisan</span> — the farmer —
        with <span className="text-foreground">Sawan</span> — the monsoon. We're an AI platform built so growers can care for
        their fields and themselves with equal precision.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <Leaf className="h-6 w-6 text-primary" />
          <h3 className="mt-3 font-display text-lg">Our mission</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Make agronomy and wellbeing equally intelligent, accessible, and affordable for every farmer.
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <Sparkles className="h-6 w-6 text-accent" />
          <h3 className="mt-3 font-display text-lg">Our approach</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            On-device AI, transparent recommendations, and tools co-designed with farming communities.
          </p>
        </div>
      </div>

      <blockquote className="glass mt-10 rounded-2xl p-8 text-center">
        <p className="font-display text-xl md:text-2xl">"Protect the farmer and the farm will flourish."</p>
        <p className="mt-2 text-sm text-muted-foreground">— Kisawan team</p>
      </blockquote>
    </div>
  );
}
