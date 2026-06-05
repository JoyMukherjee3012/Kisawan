import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartPulse, Sprout, Sparkles, Brain, Cpu, ShieldCheck } from "lucide-react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Kisawan — Protecting the farmer and the farm" },
      { name: "description", content: "AI-powered agriculture and health platform for modern farmers." },
    ],
  }),
});

function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:py-28">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI for Agriculture · Health · Climate
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Protecting both the <span className="text-gradient">farmer</span> and the <span className="text-gradient">farm</span>.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              Kisawan unites farmer wellbeing with crop intelligence — a single AI platform born from
              <span className="text-foreground"> Kisan</span> and <span className="text-foreground">Sawan</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard" className="group inline-flex items-center gap-2 rounded-full bg-neon px-6 py-3 font-medium text-primary-foreground glow-green transition-transform hover:scale-105">
                Open Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/features" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium hover:bg-white/10">
                Explore Features
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-3 text-center sm:gap-4">
              {[
                { k: "12k+", v: "Farmers" },
                { k: "98%", v: "Disease accuracy" },
                { k: "24/7", v: "AI assistant" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl bg-white/5 p-3">
                  <p className="font-display text-lg text-gradient sm:text-xl">{s.k}</p>
                  <p className="text-[11px] text-muted-foreground sm:text-xs">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 glow-green">
              <img src={hero} alt="AI agriculture visualization" width={1536} height={1024} className="h-[280px] w-full object-cover sm:h-[360px] md:h-[420px]" />
            </div>
            <div className="glass-solid absolute bottom-3 left-3 flex items-center gap-3 rounded-2xl p-3 animate-float md:-bottom-6 md:-left-6">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cool"><Brain className="h-4 w-4 text-primary-foreground" /></span>
              <div className="text-sm">
                <p className="font-medium">AI Insight</p>
                <p className="text-xs text-muted-foreground">Soil moisture optimal</p>
              </div>
            </div>
            <div className="glass-solid absolute right-3 top-3 flex items-center gap-3 rounded-2xl p-3 animate-float md:-right-4 md:top-10" style={{ animationDelay: "1.5s" }}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neon"><HeartPulse className="h-4 w-4 text-primary-foreground" /></span>
              <div className="text-sm">
                <p className="font-medium">Heart 72bpm</p>
                <p className="text-xs text-muted-foreground">Healthy zone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Two pillars, one platform</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">Built for those who feed the world</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard
            to="/dashboard"
            accent="green"
            icon={<HeartPulse className="h-6 w-6" />}
            title="Personal Health"
            desc="Hydration, fatigue, sleep and heat-stress tracking with AI recommendations tuned for field work."
            bullets={["Hydration meter", "Fatigue score", "Heat exposure alerts", "Daily wellness insights"]}
          />
          <FeatureCard
            to="/dashboard"
            accent="blue"
            icon={<Sprout className="h-6 w-6" />}
            title="Crop Health"
            desc="Disease detection from a photo, weather-aware irrigation and AI fertilizer guidance for every field."
            bullets={["Disease scan", "Weather analysis", "Soil & irrigation", "Yield forecasting"]}
          />
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: <Cpu />, t: "On-device AI", d: "Edge models work even with patchy connectivity." },
            { icon: <ShieldCheck />, t: "Private by design", d: "Your data stays yours, encrypted end-to-end." },
            { icon: <Sparkles />, t: "Built with farmers", d: "Co-designed with growers across South Asia." },
          ].map((i) => (
            <div key={i.t} className="glass rounded-2xl p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-primary">{i.icon}</span>
              <h3 className="mt-4 font-display text-lg">{i.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{i.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="glass relative overflow-hidden rounded-3xl p-10 text-center">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 blur-2xl" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl">Ready to grow smarter?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Step into a dashboard that watches over your fields and your wellbeing.
            </p>
            <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-full bg-neon px-6 py-3 font-medium text-primary-foreground glow-green hover:scale-105">
              Launch Kisawan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  to, icon, title, desc, bullets, accent,
}: {
  to: "/dashboard";
  icon: React.ReactNode;
  title: string;
  desc: string;
  bullets: string[];
  accent: "green" | "blue";
}) {
  const glow = accent === "green" ? "glow-green" : "glow-blue";
  const chip = accent === "green" ? "bg-neon" : "bg-cool";
  return (
    <Link to={to} className={`group glass relative overflow-hidden rounded-3xl p-8 transition-transform hover:-translate-y-1 ${glow}`}>
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl transition-opacity group-hover:opacity-80" />
      <div className={`grid h-14 w-14 place-items-center rounded-2xl ${chip} text-primary-foreground`}>{icon}</div>
      <h3 className="mt-6 font-display text-2xl">{title}</h3>
      <p className="mt-2 text-muted-foreground">{desc}</p>
      <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-2 text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {b}
          </li>
        ))}
      </ul>
      <div className="mt-6 inline-flex items-center gap-2 text-sm text-primary">
        Open dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
