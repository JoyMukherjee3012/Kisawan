import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, CloudRain, Droplets, FlaskConical, HeartPulse, Leaf, LineChart, Sprout, TestTube } from "lucide-react";
import { motion } from "framer-motion";

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
  { i: <Activity className="w-6 h-6" />, t: "Activity Tracking", d: "Track steps, distance, and active minutes using device motion sensors." },
  { i: <HeartPulse className="w-6 h-6" />, t: "Wellness Logging", d: "Monitor your daily sleep, water intake, mood, and stress levels." },
  { i: <LineChart className="w-6 h-6" />, t: "Health History", d: "Visualize your 7-day personal health and wellness performance scores." },
  { i: <Leaf className="w-6 h-6" />, t: "Disease Scan", d: "Upload a crop photo for instant AI-powered diagnostics and treatment steps." },
  { i: <CloudRain className="w-6 h-6" />, t: "Weather Analysis", d: "Real-time hyper-local conditions, UV index, and 5-day forecasts." },
  { i: <FlaskConical className="w-6 h-6" />, t: "Soil Engine", d: "Deep analysis of soil composition, pH, and fertility levels via SoilGrids." },
  { i: <Sprout className="w-6 h-6" />, t: "Crop Recommendations", d: "Discover the top 5 most suitable crops precisely matched to your soil." },
  { i: <Droplets className="w-6 h-6" />, t: "Smart Irrigation", d: "Get precise, AI-generated watering schedules for your field." },
  { i: <TestTube className="w-6 h-6" />, t: "Fertilizer Advisor", d: "Receive tailored nutrient and organic fertilizer recommendations." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function Features() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 overflow-hidden">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Features</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-medium tracking-tight">Everything Kisawan does</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
          One unified platform protecting both the farmer and the farm. Monitor your vitals, scan a leaf, and plan your harvest — all powered by intelligent AI.
        </p>
      </motion.div>

      <motion.div 
        className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((f, index) => (
          <motion.div 
            key={f.t} 
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-solid relative overflow-hidden rounded-3xl p-8 border border-white/5 transition-colors hover:border-emerald-500/30 group cursor-default"
          >
            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 bg-emerald-500/0 transition-colors duration-500 group-hover:bg-emerald-500/5" />
            
            <div className="relative z-10">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-900/50 text-emerald-400 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                {f.i}
              </span>
              <h3 className="mt-6 font-display text-xl font-medium text-slate-100">{f.t}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.d}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mt-20 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
      >
        <Link to="/dashboard" className="inline-flex rounded-full bg-neon px-8 py-4 text-sm font-medium text-primary-foreground glow-green hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          Try the dashboard
        </Link>
      </motion.div>
    </div>
  );
}

