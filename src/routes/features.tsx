import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, CloudRain, Droplets, FlaskConical, HeartPulse, Leaf, LineChart, Sprout, TestTube, Upload, ChevronRight, Moon, Smile, TrendingUp } from "lucide-react";
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
  { 
    i: <Activity className="w-5 h-5" />, 
    t: "Activity Tracking", 
    d: "Track steps, distance, and active minutes using device motion sensors.",
    img: "/features/feature_1.png",
    footer: (
      <div className="flex gap-4">
        <div><p className="text-emerald-400 font-display text-lg leading-none">10,248</p><p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Steps</p></div>
        <div><p className="text-emerald-400 font-display text-lg leading-none">7.6 km</p><p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Distance</p></div>
        <div><p className="text-emerald-400 font-display text-lg leading-none">62</p><p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Min Active</p></div>
      </div>
    )
  },
  { 
    i: <HeartPulse className="w-5 h-5" />, 
    t: "Wellness Logging", 
    d: "Monitor your daily sleep, water intake, mood, and stress levels.",
    img: "/features/feature_2.png",
    footer: (
      <div className="flex gap-4">
        <div className="text-center"><Moon className="w-4 h-4 text-emerald-400 mb-1.5 mx-auto"/><p className="text-slate-200 text-xs leading-none">7h 45m</p><p className="text-[10px] text-slate-500 mt-1">Sleep</p></div>
        <div className="text-center"><Droplets className="w-4 h-4 text-emerald-400 mb-1.5 mx-auto"/><p className="text-slate-200 text-xs leading-none">2.1 L</p><p className="text-[10px] text-slate-500 mt-1">Water</p></div>
        <div className="text-center"><Smile className="w-4 h-4 text-emerald-400 mb-1.5 mx-auto"/><p className="text-slate-200 text-xs leading-none">Good</p><p className="text-[10px] text-slate-500 mt-1">Mood</p></div>
      </div>
    )
  },
  { 
    i: <LineChart className="w-5 h-5" />, 
    t: "Health History", 
    d: "Visualize your 7-day personal health and wellness performance scores.",
    img: "/features/feature_3.png",
    footer: (
      <div className="flex items-center gap-4">
        <div><p className="text-emerald-400 font-display text-2xl leading-none">87</p><p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Health Score</p></div>
        <div className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 flex items-center gap-1 border border-emerald-500/20"><TrendingUp className="w-3 h-3"/> 12%</div>
      </div>
    )
  },
  { 
    i: <Leaf className="w-5 h-5" />, 
    t: "Disease Scan", 
    d: "Upload a crop photo for instant AI diagnostics and treatment steps.",
    img: "/features/feature_4.png",
    footer: (
      <button className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20 hover:scale-105"><Upload className="w-3 h-3" /> Upload Image</button>
    )
  },
  { 
    i: <CloudRain className="w-5 h-5" />, 
    t: "Weather Analysis", 
    d: "Real-time hyper-local conditions, UV index, and 5-day forecasts.",
    img: "/features/feature_5.png",
    footer: (
      <div className="flex gap-5">
        <div><p className="text-emerald-400 font-display text-xl leading-none">31°C</p><p className="text-[10px] text-slate-400 mt-1">Partly Cloudy</p></div>
        <div><p className="text-emerald-400 font-display text-xl leading-none">32%</p><p className="text-[10px] text-slate-500 mt-1">Humidity</p></div>
        <div><p className="text-emerald-400 font-display text-xl leading-none">5</p><p className="text-[10px] text-slate-500 mt-1">UV Index</p></div>
      </div>
    )
  },
  { 
    i: <FlaskConical className="w-5 h-5" />, 
    t: "Soil Engine", 
    d: "Deep analysis of soil composition, pH, and fertility levels via SoilGrids.",
    img: "/features/feature_6.png",
    footer: (
      <div className="flex gap-4">
        <div><p className="text-emerald-400 font-display text-xl leading-none">78%</p><p className="text-[10px] text-slate-500 mt-1">Soil Health</p></div>
        <div><p className="text-emerald-400 font-display text-xl leading-none">6.4</p><p className="text-[10px] text-slate-500 mt-1">pH Level</p></div>
        <div><p className="text-emerald-400 font-display text-xl leading-none">High</p><p className="text-[10px] text-slate-500 mt-1">Fertility</p></div>
      </div>
    )
  },
  { 
    i: <Sprout className="w-5 h-5" />, 
    t: "Crop Recommendations", 
    d: "Discover the top 5 most suitable crops precisely matched to your soil.",
    img: "/features/feature_7.png",
    footer: (
      <button className="flex items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium text-emerald-400 transition hover:text-emerald-300">View Recommendations <ChevronRight className="w-3 h-3" /></button>
    )
  },
  { 
    i: <Droplets className="w-5 h-5" />, 
    t: "Smart Irrigation", 
    d: "Get precise, AI-generated watering schedules for your field.",
    img: "/features/feature_8.png",
    footer: (
      <div className="flex gap-5">
        <div><p className="text-emerald-400 font-display text-lg leading-none">78%</p><p className="text-[10px] text-slate-500 mt-1">Soil Moisture</p></div>
        <div><p className="text-emerald-400 font-display text-lg leading-none">18h 30m</p><p className="text-[10px] text-slate-500 mt-1">Next Watering</p></div>
      </div>
    )
  },
  { 
    i: <TestTube className="w-5 h-5" />, 
    t: "Fertilizer Advisor", 
    d: "Receive tailored nutrient and organic fertilizer recommendations.",
    img: "/features/feature_9.png",
    footer: (
      <button className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20 hover:scale-105">Get Recommendation <ChevronRight className="w-3 h-3" /></button>
    )
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function Features() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 overflow-hidden bg-[#020806]">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-semibold">Features</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-medium tracking-tight text-slate-100">Intelligent Dashboards</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400 leading-relaxed text-sm">
          A truly unified experience.
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
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative h-[280px] overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-[#06120d] to-[#030805] shadow-[0_0_30px_rgba(16,185,129,0.03)] transition-colors hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.08)] group"
          >
            {/* The 3D Image */}
            <div className="absolute right-[-10%] bottom-0 h-[85%] w-[55%] z-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500">
               <img src={f.img} alt={f.t} className="w-full h-full object-contain object-bottom scale-110" />
               {/* Vignette fade for the image edge */}
               <div className="absolute inset-0 bg-gradient-to-r from-[#06120d] to-transparent via-transparent"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#06120d] via-transparent to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex h-full flex-col p-7 w-[65%]">
              <div className="flex justify-between items-start">
                 <span className="grid h-12 w-12 place-items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                   {f.i}
                 </span>
                 <div className="absolute top-6 right-6 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-400 font-medium">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></div>
                   Live
                 </div>
              </div>
              
              <h3 className="mt-5 font-display text-lg font-medium text-slate-100">{f.t}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed pr-2">{f.d}</p>
              
              <div className="mt-auto">
                {f.footer}
              </div>
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
        <Link to="/dashboard" className="inline-flex rounded-full bg-emerald-500 px-8 py-4 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]">
          Open Full Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

