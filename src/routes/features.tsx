import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Brain, CloudRain, Droplets, FlaskConical, HeartPulse, Leaf, Moon, ShieldCheck, Sprout, Sun, Thermometer } from "lucide-react";

export const Route = createFileRoute("/features")({
  component: Features,
  head: () => ({
    meta: [
      { title: "Features — Kisawan" },
      { name: "description", content: "Discover Kisawan's AI features across health and agriculture." },
    ],
  }),
});

const items = [
  { i: <Droplets />, t: "Hydration meter", d: "Track fluid intake against heat & workload." },
  { i: <Activity />, t: "Fatigue score", d: "AI-derived effort and recovery index." },
  { i: <Moon />, t: "Sleep tracker", d: "Quality, duration and trend." },
  { i: <Thermometer />, t: "Heat exposure", d: "Real-time UV and thermal stress warnings." },
  { i: <HeartPulse />, t: "Vitals", d: "Heart rate, SpO₂, steps and HRV." },
  { i: <Brain />, t: "AI wellness", d: "Personalized daily recommendations." },
  { i: <Leaf />, t: "Disease scan", d: "Detect blight, rust, mildew from a photo." },
  { i: <CloudRain />, t: "Weather AI", d: "Hyper-local forecasts for your fields." },
  { i: <FlaskConical />, t: "Soil health", d: "N–P–K, pH, organic matter at a glance." },
  { i: <Sprout />, t: "Yield forecast", d: "Predict harvest with ML models." },
  { i: <Sun />, t: "Irrigation advice", d: "Save water, protect roots." },
  { i: <ShieldCheck />, t: "Private by design", d: "Your data stays encrypted and yours." },
];

function Features() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Features</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Everything Kisawan does</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          One platform for the farmer and the farm. Glance at vitals, scan a leaf, plan irrigation — all from your phone.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <div key={f.t} className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-primary">{f.i}</span>
            <h3 className="mt-4 font-display text-lg">{f.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link to="/dashboard" className="inline-flex rounded-full bg-neon px-6 py-3 font-medium text-primary-foreground glow-green hover:scale-105">
          Try the dashboard
        </Link>
      </div>
    </div>
  );
}
