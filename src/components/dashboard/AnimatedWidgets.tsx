import { CloudLightning, Droplets, Sprout, Wind, Compass, Sun, CloudRain, Cloud, CloudSnow } from "lucide-react";

export function WeatherWidget({ temp, text }: { temp: string, text: string }) {
  // Determine gradient and icon based on weather text
  const isStorm = text.toLowerCase().includes("thunder") || text.toLowerCase().includes("storm");
  const isRain = text.toLowerCase().includes("rain") || text.toLowerCase().includes("drizzle") || text.toLowerCase().includes("shower");
  const isSnow = text.toLowerCase().includes("snow") || text.toLowerCase().includes("ice") || text.toLowerCase().includes("flurries");
  const isCloudy = text.toLowerCase().includes("cloud") || text.toLowerCase().includes("overcast");
  
  const gradient = isStorm 
    ? "from-indigo-950 via-slate-900 to-indigo-950" 
    : isRain 
    ? "from-slate-800 via-slate-900 to-slate-800"
    : isSnow
    ? "from-slate-800 via-slate-800 to-sky-950"
    : isCloudy
    ? "from-slate-800 via-slate-800 to-slate-900"
    : "from-sky-900/40 via-slate-900 to-slate-900";

  return (
    <div className={`glass rounded-[2rem] p-6 min-h-[220px] overflow-hidden relative bg-gradient-to-br ${gradient}`}>
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-300">Weather</p>
        <p className="text-xs text-slate-400 mt-1 truncate">{text}</p>
        <p className="mt-4 font-display text-4xl font-bold tracking-tight">{temp}</p>
      </div>
      
      {/* Animated Graphic */}
      <div className="absolute right-0 bottom-0 w-24 h-24 opacity-80 mix-blend-screen">
        {isStorm ? (
          <div className="relative w-full h-full flex items-center justify-center">
             <CloudLightning className="w-14 h-14 text-slate-300 absolute z-10 animate-float" />
             <div className="absolute w-14 h-14 text-yellow-300 animate-lightning"><CloudLightning /></div>
             <Droplets className="w-6 h-6 text-blue-400 absolute bottom-2 animate-rain" style={{ animationDelay: '0.2s' }} />
          </div>
        ) : isRain ? (
          <div className="relative w-full h-full flex items-center justify-center">
             <CloudRain className="w-14 h-14 text-slate-300 absolute z-10 animate-float" />
             <Droplets className="w-5 h-5 text-blue-400 absolute bottom-4 right-4 animate-rain" />
             <Droplets className="w-5 h-5 text-blue-400 absolute bottom-0 left-4 animate-rain" style={{ animationDelay: '0.4s' }} />
          </div>
        ) : isSnow ? (
          <div className="relative w-full h-full flex items-center justify-center">
             <CloudSnow className="w-14 h-14 text-slate-300 absolute z-10 animate-float" />
             <div className="w-3 h-3 rounded-full bg-white absolute bottom-4 right-4 animate-rain shadow-[0_0_5px_white]"></div>
             <div className="w-3 h-3 rounded-full bg-white absolute bottom-0 left-4 animate-rain shadow-[0_0_5px_white]" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : isCloudy ? (
          <div className="relative w-full h-full flex items-center justify-center">
             <Cloud className="w-16 h-16 text-slate-300 animate-float opacity-90 drop-shadow-[0_0_20px_rgba(203,213,225,0.4)]" />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
             <Sun className="w-16 h-16 text-yellow-400 animate-sun opacity-90 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
          </div>
        )}
      </div>
    </div>
  );
}

export function HumidityWidget({ value }: { value: string }) {
  return (
    <div className="glass rounded-[2rem] p-6 min-h-[220px] overflow-hidden relative bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950/40 border-emerald-500/10">
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-300">Humidity</p>
        <p className="text-xs text-emerald-400/80 mt-1">High</p>
        <p className="mt-4 font-display text-4xl font-bold tracking-tight">{value}<span className="text-lg text-muted-foreground ml-1">%</span></p>
      </div>
      <div className="absolute right-0 bottom-0 w-24 h-24 flex items-center justify-center opacity-70">
         <Droplets className="w-14 h-14 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)] animate-float" />
         <Droplets className="w-8 h-8 text-blue-300 absolute bottom-4 right-12 opacity-50 animate-float" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}

export function SoilScoreWidget({ score }: { score: string }) {
  const isGood = Number(score) > 60;
  return (
    <div className="glass rounded-[2rem] p-6 min-h-[220px] overflow-hidden relative bg-gradient-to-t from-amber-950/60 via-slate-900 to-slate-900 border-amber-500/10">
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-300">Soil Score</p>
        <p className="text-xs text-amber-400/80 mt-1">{isGood ? "Good" : "Needs Attention"}</p>
        <p className="mt-4 font-display text-4xl font-bold tracking-tight">{score}<span className="text-lg text-muted-foreground ml-1">/100</span></p>
      </div>
      <div className="absolute right-0 bottom-0 w-28 h-24 flex flex-col items-center justify-end opacity-90">
         <Sprout className="w-12 h-12 text-emerald-400 mb-1 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)] z-10 animate-float" />
         <div className="w-24 h-10 bg-amber-800/60 rounded-t-full blur-[3px] border-t border-amber-600/30"></div>
      </div>
    </div>
  );
}

export function WindWidget({ speed }: { speed: string }) {
  return (
    <div className="glass rounded-[2rem] p-6 min-h-[220px] overflow-hidden relative bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-900 border-blue-500/10">
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-300">Wind</p>
        <p className="text-xs text-blue-400/80 mt-1">Moderate</p>
        <p className="mt-4 font-display text-4xl font-bold tracking-tight">{speed}<span className="text-lg text-muted-foreground ml-1">km/h</span></p>
      </div>
      <div className="absolute right-0 bottom-2 w-24 h-24 flex items-center justify-center opacity-60">
         <Wind className="w-16 h-16 text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.5)]" />
         <div className="absolute w-6 h-[2px] bg-blue-300 top-4 left-4 animate-wind"></div>
         <div className="absolute w-8 h-[2px] bg-blue-300 bottom-6 left-1 animate-wind" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}

export function DirectionWidget({ direction }: { direction: string }) {
  return (
    <div className="glass rounded-[2rem] p-6 min-h-[220px] overflow-hidden relative bg-gradient-to-tr from-slate-900 via-slate-900 to-indigo-950/30">
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-300">Direction</p>
        <p className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-200">{direction}</p>
      </div>
      <div className="absolute right-0 bottom-0 w-24 h-24 flex items-center justify-center opacity-80">
         <div className="relative w-16 h-16 rounded-full border border-slate-600/50 bg-slate-800/80 shadow-inner flex items-center justify-center">
            <span className="absolute top-1 text-[8px] font-bold text-red-400">N</span>
            <span className="absolute bottom-1 text-[8px] font-bold text-slate-400">S</span>
            <span className="absolute right-1 text-[8px] font-bold text-slate-400">E</span>
            <span className="absolute left-1 text-[8px] font-bold text-slate-400">W</span>
            <Compass className="w-10 h-10 text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.4)]" style={{ transform: 'rotate(45deg)' }} />
         </div>
      </div>
    </div>
  );
}
