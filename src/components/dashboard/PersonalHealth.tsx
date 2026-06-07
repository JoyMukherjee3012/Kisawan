import { useState, useMemo } from "react";
import { Activity, Brain, Droplets, Heart, Moon, Sun, Thermometer, User, Zap, MapPin, Loader2, Edit2, Info, X, Target, ShieldCheck, Plus, Sparkles, Flame } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { GaugeRing } from "./Widgets";
import { useHealthTracking } from "@/hooks/useHealthTracking";
import { useQuery } from "@tanstack/react-query";
import { getEnv } from "@/lib/env";

function ImageStatCard({ icon, topRightText, title, value, unit }: any) {
  return (
    <div className="bg-[#0b1418] rounded-3xl p-5 border border-white/5 flex flex-col justify-between hover:-translate-y-1 transition-transform h-full shadow-lg shadow-black/20">
      <div className="flex justify-between items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-[#112326] flex items-center justify-center text-emerald-400">
          {icon}
        </div>
        <span className="text-[11px] text-slate-400 font-medium tracking-wide">{topRightText}</span>
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-display font-bold text-slate-100 flex items-baseline gap-1">
          {value}
          {unit && <span className="text-xs text-slate-400 font-normal">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

function TargetSidebarItem({ icon, colorClass, title, current, target, unit, onEdit }: any) {
  const percentage = Math.min(100, (current / target) * 100);
  return (
    <div className="mb-7">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className={colorClass}>{icon}</div>
          <div>
            <p className="text-sm text-slate-300 mb-0.5">{title}</p>
            <p className="text-sm font-bold text-white flex items-baseline gap-1">
               {typeof current === 'number' && current % 1 !== 0 ? current.toFixed(1) : current} 
               <span className="text-[11px] font-normal text-slate-400">/ {target} {unit} ({Math.round(percentage)}%)</span>
            </p>
          </div>
        </div>
        <button onClick={onEdit} className="text-slate-500 hover:text-white transition"><Edit2 className="w-3.5 h-3.5" /></button>
      </div>
      <div className="w-full h-1.5 bg-[#111e22] rounded-full overflow-hidden mt-3">
        <div className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function BMIGauge({ bmi, height, weight, onEdit, isPreview = false }: any) {
  let category = "Normal";
  let color = "#10b981"; // emerald
  if (bmi < 18.5) { category = "Underweight"; color = "#3b82f6"; } // blue
  else if (bmi >= 25 && bmi < 30) { category = "Overweight"; color = "#eab308"; } // yellow
  else if (bmi >= 30) { category = "Obese"; color = "#ef4444"; } // red

  const minBmi = 15;
  const maxBmi = 35;
  const clamped = Math.max(minBmi, Math.min(maxBmi, bmi));
  const percentage = (clamped - minBmi) / (maxBmi - minBmi);
  const r = 50;
  const c = Math.PI * r;
  const offset = c - (percentage * c);

  return (
    <div className={`bg-[#0b1418] rounded-3xl p-5 border ${isPreview ? 'border-white/5' : 'border-[#00e5ff]/30'} shadow-lg ${isPreview ? '' : 'shadow-[#00e5ff]/5'} relative flex flex-col items-center justify-between h-full`}>
      <div className="absolute top-4 left-4 flex items-center gap-1.5 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
         <User className="w-3.5 h-3.5" /> BMI
      </div>
      {!isPreview && (
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <button className="text-slate-500 hover:text-[#00e5ff] transition"><Info className="w-4 h-4" /></button>
          <button onClick={onEdit} className="text-slate-500 hover:text-white transition"><Edit2 className="w-4 h-4" /></button>
        </div>
      )}

      <div className="relative w-36 h-20 mt-8 flex justify-center overflow-hidden">
        <svg viewBox="0 0 120 65" className="w-full h-full transform">
           <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#111e22" strokeWidth="8" strokeLinecap="round" />
           <path 
             d="M 10 60 A 50 50 0 0 1 110 60" 
             fill="none" 
             stroke={color} 
             strokeWidth="8" 
             strokeLinecap="round" 
             strokeDasharray={c}
             strokeDashoffset={offset}
             style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "all 1s ease-out" }}
           />
        </svg>
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-3xl font-display font-bold text-white">{bmi.toFixed(1)}</span>
          <span className="text-xs font-medium" style={{ color }}>{category}</span>
        </div>
      </div>

      <div className="w-full max-w-[180px]">
        <div className="flex w-full justify-between items-center px-1 mt-4">
          <div className="h-1 flex-1 bg-blue-500 rounded-l-full mx-0.5"></div>
          <div className="h-1 flex-1 bg-emerald-500 mx-0.5"></div>
          <div className="h-1 flex-1 bg-yellow-500 mx-0.5"></div>
          <div className="h-1 flex-1 bg-red-500 rounded-r-full mx-0.5"></div>
        </div>
        <div className="flex w-full justify-between px-1 mt-1 text-[8px] text-slate-500 font-medium">
          <span>&lt;18.5</span>
          <span>18.5-24.9</span>
          <span>25-29.9</span>
          <span>&ge;30</span>
        </div>
      </div>

      {!isPreview && (
        <div className="mt-5 w-full text-center border-t border-white/5 pt-3">
          <p className="text-[11px] text-slate-400">Height: {height} cm • Weight: {weight} kg</p>
          <p className="text-[10px] text-emerald-500 mt-1 flex items-center justify-center gap-1">Updated: just now <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span></p>
        </div>
      )}
      {isPreview && (
        <div className="mt-3 w-full text-center">
           <p className="text-[10px] text-slate-400">Your BMI is in the {category.toLowerCase()} range.</p>
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0b1418]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl shadow-black/40">
        <p className="text-slate-300 text-xs font-medium mb-3">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-bold flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: entry.color }}></span>
              <span className="text-slate-200 font-medium w-12">{entry.name}:</span> {entry.value}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function PersonalHealth({
  displayName = "joymukh3012",
  age,
}: { displayName?: string; age?: number | null } = {}) {
  
  const [historyDays, setHistoryDays] = useState<number>(7);
  const { 
    data, history, wellnessLog, targets, isConnected, isDemoMode, error, 
    requestPermissions, updateWellnessLog, updateTargets 
  } = useHealthTracking(historyDays);

  const [showBMIEdit, setShowBMIEdit] = useState(false);
  const [showTargetsEdit, setShowTargetsEdit] = useState(false);
  const [showFullInsights, setShowFullInsights] = useState(false);
  
  const [tempHeight, setTempHeight] = useState(wellnessLog.heightCm || 175);
  const [tempWeight, setTempWeight] = useState(wellnessLog.weightKg || 71.6);
  
  const [tempTargets, setTempTargets] = useState(targets);
  
  const tempBmi = useMemo(() => {
    if (!tempHeight || !tempWeight) return 0;
    return tempWeight / Math.pow(tempHeight / 100, 2);
  }, [tempHeight, tempWeight]);

  // Actual BMI calculation
  const bmi = (wellnessLog.weightKg && wellnessLog.heightCm) 
    ? (wellnessLog.weightKg / Math.pow(wellnessLog.heightCm / 100, 2))
    : 23.4; // fallback to user's image

  // Health Score Calculation (0-100)
  let healthScore = 0;
  healthScore += Math.min(30, (data.steps / 10000) * 30);
  healthScore += Math.min(20, (data.activeMinutes / 60) * 20);
  healthScore += Math.min(20, (wellnessLog.sleepHours / 8) * 20);
  healthScore += Math.min(20, (wellnessLog.waterLiters / 3.5) * 20);
  if (bmi >= 18.5 && bmi <= 25) healthScore += 10;
  else if (bmi > 25 && bmi < 30) healthScore += 5;
  healthScore = Math.round(healthScore);

  let fatigueLevel = "Low";
  if (healthScore < 50) fatigueLevel = "High";
  else if (healthScore < 75) fatigueLevel = "Moderate";

  const { data: aiInsights, isLoading: loadingInsights } = useQuery({
    queryKey: ['health-insights', data.steps, data.activeMinutes, wellnessLog],
    queryFn: async () => {
      const GEMINI_API_KEY = getEnv().VITE_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) return null;
      
      const prompt = `Act as Pocket Health AI. Analyze this user's health data: Steps: ${data.steps}, Active Mins: ${data.activeMinutes}, Sleep: ${wellnessLog.sleepHours}, Water: ${wellnessLog.waterLiters}, BMI: ${bmi.toFixed(1)}. Output JSON: { "summary": "...", "recommendations": [] }`;

      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, responseMimeType: "application/json" } })
        });
        const resData = await res.json();
        let text = resData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        return JSON.parse(text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim());
      } catch (e) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: isConnected,
  });

  const chartData = useMemo(() => {
    return history.map(d => ({
      date: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      Steps: d.steps / 1000,
      Water: d.waterLiters,
      Sleep: d.sleepHours
    }));
  }, [history]);

  return (
    <div className="relative pb-24">
      
      {!isConnected && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#020608]/80 backdrop-blur-md rounded-3xl border border-emerald-500/10">
          <div className="bg-[#0b1418] p-8 rounded-3xl max-w-md text-center border border-white/5 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-100 mb-2">Connect Device</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Enable motion sensors and geolocation to access the full Pocket Health AI dashboard.
            </p>
            <button 
              onClick={requestPermissions}
              className="w-full bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" /> Enable Tracking
            </button>
          </div>
        </div>
      )}

      {/* Main Grid Restructure */}
      <div className="grid lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* LEFT COLUMN: Profile, Rings, Stats, BMI, History */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Row 1: Profile & Rings */}
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="bg-[#0b1418] border border-white/5 rounded-3xl p-6 lg:col-span-5 shadow-lg shadow-black/20 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-6 relative z-10">
                 <div className="w-14 h-14 bg-[#00ff9d] rounded-full flex items-center justify-center text-emerald-950 shrink-0">
                   <User className="w-7 h-7" />
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 font-medium">Farmer</p>
                   <p className="text-lg font-bold text-slate-100 font-display tracking-wide">{displayName}</p>
                   <p className="text-[11px] text-slate-500 mt-0.5">Personal wellness</p>
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-3 relative z-10">
                <div className="bg-[#111e22] rounded-2xl py-3 px-2 flex flex-col items-center justify-center border border-white/5">
                   <Heart className="w-4 h-4 text-rose-500 mb-1" />
                   <p className="text-xs text-slate-400 mb-0.5">Heart</p>
                   <p className="text-sm font-bold text-slate-200">72 <span className="text-[9px] font-normal text-slate-500">bpm</span></p>
                </div>
                <div className="bg-[#111e22] rounded-2xl py-3 px-2 flex flex-col items-center justify-center border border-white/5">
                   <Droplets className="w-4 h-4 text-cyan-500 mb-1" />
                   <p className="text-xs text-slate-400 mb-0.5">SpO₂</p>
                   <p className="text-sm font-bold text-slate-200">98<span className="text-[9px] font-normal text-slate-500">%</span></p>
                </div>
                <div className="bg-[#111e22] rounded-2xl py-3 px-2 flex flex-col items-center justify-center border border-white/5">
                   <Activity className="w-4 h-4 text-emerald-500 mb-1" />
                   <p className="text-xs text-slate-400 mb-0.5">Steps</p>
                   <p className="text-sm font-bold text-slate-200">{(data.steps / 1000).toFixed(1)}<span className="text-[9px] font-normal text-slate-500">k</span></p>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1418] border border-white/5 rounded-3xl p-6 lg:col-span-7 shadow-lg shadow-black/20 flex flex-col justify-center">
              <div className="flex items-center justify-between w-full">
                <GaugeRing 
                  value={Math.round(Math.min(100, (wellnessLog.waterLiters / 3.5) * 100))} 
                  size={120}
                  label="Hydration" 
                  sub={`${wellnessLog.waterLiters.toFixed(1)}L / 3.5L`} 
                  color="#00e5ff" 
                />
                <GaugeRing 
                  value={healthScore} 
                  size={120}
                  label="Fatigue" 
                  sub={fatigueLevel} 
                  color="#00ff9d" 
                />
                <GaugeRing 
                  value={Math.round(Math.min(100, (wellnessLog.sleepHours / 8) * 100))} 
                  size={120}
                  label="Sleep" 
                  sub={`${wellnessLog.sleepHours}h`} 
                  color="#0088ff" 
                />
              </div>
            </div>
          </div>

          {/* Row 2: 4 Small Cards & BMI Gauge */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <ImageStatCard 
                icon={<Droplets className="w-5 h-5 text-[#00e5ff]" />}
                topRightText="Goal 3.5L"
                title="Water today"
                value={wellnessLog.waterLiters.toFixed(1)}
                unit="L"
              />
              <ImageStatCard 
                icon={<Activity className="w-5 h-5 text-[#00ff9d]" />}
                topRightText="Moderate"
                title="Fatigue score"
                value={healthScore}
                unit="/100"
              />
              <ImageStatCard 
                icon={<Moon className="w-5 h-5 text-[#0088ff]" />}
                topRightText="+0.4 vs avg"
                title="Sleep"
                value={wellnessLog.sleepHours}
                unit="hrs"
              />
              <ImageStatCard 
                icon={<Thermometer className="w-5 h-5 text-emerald-400" />}
                topRightText="38°C · UV 9"
                title="Heat exposure"
                value="High"
              />
            </div>
            <div className="lg:col-span-1">
              <BMIGauge 
                bmi={bmi} 
                height={wellnessLog.heightCm || 175} 
                weight={wellnessLog.weightKg || 71.6} 
                onEdit={() => {
                  setTempHeight(wellnessLog.heightCm || 175);
                  setTempWeight(wellnessLog.weightKg || 71.6);
                  setShowBMIEdit(true);
                }} 
              />
            </div>
          </div>

          {/* Row 3: Health History Chart */}
          <div className="bg-[#0b1418] border border-white/5 rounded-3xl p-6 shadow-lg shadow-black/20 mt-2">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
                Health History <span className="text-slate-400 font-normal text-sm">(Real Data)</span>
              </h3>
              <div className="flex bg-[#111e22] rounded-full p-1 border border-white/5">
                <button onClick={() => setHistoryDays(7)} className={`px-4 py-1 text-xs font-bold rounded-full transition ${historyDays === 7 ? "bg-[#00e5ff]/20 text-[#00e5ff]" : "text-slate-400 hover:text-slate-200"}`}>7D</button>
                <button onClick={() => setHistoryDays(30)} className={`px-4 py-1 text-xs font-bold rounded-full transition ${historyDays === 30 ? "bg-[#00e5ff]/20 text-[#00e5ff]" : "text-slate-400 hover:text-slate-200"}`}>30D</button>
                <button onClick={() => setHistoryDays(90)} className={`px-4 py-1 text-xs font-bold rounded-full transition ${historyDays === 90 ? "bg-[#00e5ff]/20 text-[#00e5ff]" : "text-slate-400 hover:text-slate-200"}`}>90D</button>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mb-6 px-2 text-[11px] font-bold uppercase tracking-wider">
               <div className="flex items-center gap-2 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Steps (count)</div>
               <div className="flex items-center gap-2 text-[#00e5ff]"><span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]"></span> Water (L)</div>
               <div className="flex items-center gap-2 text-[#b528ff]"><span className="w-2.5 h-2.5 rounded-full bg-[#b528ff]"></span> Sleep (hrs)</div>
            </div>

            <div className="h-[250px] w-full relative">
              {chartData.length === 0 && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0b1418]/80 backdrop-blur-sm rounded-xl">
                   <p className="text-slate-400 text-sm">Not enough data to display history.</p>
                   <p className="text-slate-500 text-xs mt-1">Keep tracking to build your charts!</p>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#111e22" vertical={false} />
                  <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis yAxisId="left" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}K`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1e293b', strokeWidth: 2, strokeDasharray: '4 4' }} />
                  <Line yAxisId="left" type="monotone" dataKey="Steps" stroke="#34d399" strokeWidth={3} dot={{ fill: '#34d399', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#34d399', stroke: '#0b1418', strokeWidth: 2 }} />
                  <Line yAxisId="right" type="monotone" dataKey="Sleep" stroke="#b528ff" strokeWidth={3} dot={{ fill: '#b528ff', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#b528ff', stroke: '#0b1418', strokeWidth: 2 }} />
                  <Line yAxisId="right" type="monotone" dataKey="Water" stroke="#00e5ff" strokeWidth={3} dot={{ fill: '#00e5ff', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#00e5ff', stroke: '#0b1418', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center mt-6 text-[10px] text-slate-500 pt-4 border-t border-white/5">
              <p className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Data is synced from your phone sensors (GPS, Motion, Hydration)</p>
              <p className="flex items-center gap-1.5">Updated: just now <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span></p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Targets & Insights */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Targets Sidebar */}
          <div className="bg-[#0b1418] border border-white/5 rounded-3xl p-6 shadow-lg shadow-black/20 flex flex-col justify-between">
             <div>
               <div className="flex items-center gap-2 mb-8">
                 <Target className="w-6 h-6 text-slate-300" />
                 <h3 className="font-display text-xl font-bold text-slate-100">Targets</h3>
               </div>

               <TargetSidebarItem 
                 icon={<Activity className="w-5 h-5" />} colorClass="text-emerald-400"
                 title="Daily target steps" current={data.steps} target={targets.steps} unit="steps" onEdit={() => { setTempTargets(targets); setShowTargetsEdit(true); }}
               />
               <TargetSidebarItem 
                 icon={<Droplets className="w-5 h-5" />} colorClass="text-[#00e5ff]"
                 title="Daily target water intake" current={wellnessLog.waterLiters} target={targets.water} unit="L" onEdit={() => { setTempTargets(targets); setShowTargetsEdit(true); }}
               />
               <TargetSidebarItem 
                 icon={<Flame className="w-5 h-5" />} colorClass="text-[#ff6b2b]"
                 title="Daily target calories" current={Math.round(data.calories)} target={targets.calories} unit="kcal" onEdit={() => { setTempTargets(targets); setShowTargetsEdit(true); }}
               />
               <TargetSidebarItem 
                 icon={<Zap className="w-5 h-5" />} colorClass="text-[#00ff9d]"
                 title="Daily target active minutes" current={data.activeMinutes} target={targets.activeMinutes} unit="min" onEdit={() => { setTempTargets(targets); setShowTargetsEdit(true); }}
               />
             </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-[#0b1418] border border-white/5 rounded-3xl p-6 shadow-lg shadow-black/20">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-amber-400" />
                 <h3 className="font-display text-lg font-bold text-slate-100">Insights</h3>
               </div>
               <div className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold text-white tracking-wider">AI</div>
             </div>

             <div className="min-h-[100px]">
               {loadingInsights ? (
                 <div className="flex items-center justify-center h-full">
                   <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                 </div>
               ) : (
                 <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                   {aiInsights?.summary || "Great job! Keep up the consistency and maintain your daily targets."}
                 </p>
               )}
             </div>

             <button onClick={() => setShowFullInsights(true)} className="w-full mt-6 py-3 bg-[#111e22] hover:bg-white/10 transition rounded-xl text-sm font-medium text-slate-300">
               View full insights
             </button>
          </div>

          {/* Daily Wellness Logger */}
          <div className="bg-[#0b1418] border border-white/5 rounded-3xl p-6 shadow-lg shadow-black/20">
             <div className="flex items-center gap-2 mb-5">
               <Edit2 className="w-5 h-5 text-slate-300" />
               <h3 className="font-display text-lg font-bold text-slate-100">Daily Log</h3>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                   <Moon className="w-3.5 h-3.5 text-[#0088ff]"/> Sleep duration
                 </label>
                 <div className="relative">
                    <input 
                      type="number" step="0.5" 
                      value={wellnessLog.sleepHours || ""} 
                      onChange={(e) => updateWellnessLog({sleepHours: parseFloat(e.target.value) || 0})} 
                      className="w-full bg-[#111e22] border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-sm text-white outline-none focus:border-[#0088ff] transition" 
                      placeholder="e.g. 7.5"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">hrs</span>
                 </div>
               </div>
               <div>
                 <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                   <Droplets className="w-3.5 h-3.5 text-[#00e5ff]"/> Water Intake
                 </label>
                 <div className="relative">
                    <input 
                      type="number" step="0.1" 
                      value={wellnessLog.waterLiters || ""} 
                      onChange={(e) => updateWellnessLog({waterLiters: parseFloat(e.target.value) || 0})} 
                      className="w-full bg-[#111e22] border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-sm text-white outline-none focus:border-[#00e5ff] transition" 
                      placeholder="e.g. 2.5"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">L</span>
                 </div>
               </div>
             </div>
          </div>
        </div>

      </div>

      {/* Edit BMI Modal */}
      {showBMIEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1418] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-white">Edit BMI</h3>
              <button onClick={() => setShowBMIEdit(false)} className="text-slate-400 hover:text-white transition p-1"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Height</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={tempHeight || ""} 
                      onChange={(e) => setTempHeight(parseFloat(e.target.value) || 0)} 
                      className="w-full bg-[#111e22] border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-sm text-white outline-none focus:border-[#00e5ff] transition" 
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">cm</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Weight</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={tempWeight || ""} 
                      onChange={(e) => setTempWeight(parseFloat(e.target.value) || 0)} 
                      className="w-full bg-[#111e22] border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-sm text-white outline-none focus:border-[#00e5ff] transition" 
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">kg</span>
                  </div>
                </div>
                <div className="bg-[#111e22]/50 border border-[#00e5ff]/20 rounded-xl p-3 flex gap-2 items-start mt-2">
                  <Info className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-300 leading-tight font-medium">Tip: Keep your profile updated for accurate health insights.</p>
                </div>
              </div>

              <div className="flex-1">
                 <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2 pl-2">BMI Preview</p>
                 <BMIGauge bmi={tempBmi} isPreview={true} />
              </div>
            </div>

            <button 
              onClick={() => {
                updateWellnessLog({ heightCm: tempHeight, weightKg: tempWeight });
                setShowBMIEdit(false);
              }}
              className="w-full mt-6 py-3 bg-[#00e5ff] hover:bg-[#00cce6] text-[#05181a] rounded-xl text-sm font-bold transition shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}

      {/* Edit Targets Modal */}
      {showTargetsEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1418] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-white">Edit Targets</h3>
              <button onClick={() => setShowTargetsEdit(false)} className="text-slate-400 hover:text-white transition p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Daily Steps</label>
                  <input type="number" value={tempTargets.steps} onChange={(e) => setTempTargets({...tempTargets, steps: parseInt(e.target.value)||0})} className="w-full bg-[#111e22] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#00e5ff] transition" />
               </div>
               <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Water Intake (L)</label>
                  <input type="number" step="0.1" value={tempTargets.water} onChange={(e) => setTempTargets({...tempTargets, water: parseFloat(e.target.value)||0})} className="w-full bg-[#111e22] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#00e5ff] transition" />
               </div>
               <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Calories (kcal)</label>
                  <input type="number" value={tempTargets.calories} onChange={(e) => setTempTargets({...tempTargets, calories: parseInt(e.target.value)||0})} className="w-full bg-[#111e22] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#00e5ff] transition" />
               </div>
               <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Active Minutes</label>
                  <input type="number" value={tempTargets.activeMinutes} onChange={(e) => setTempTargets({...tempTargets, activeMinutes: parseInt(e.target.value)||0})} className="w-full bg-[#111e22] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#00e5ff] transition" />
               </div>
            </div>
            <button 
              onClick={() => { updateTargets(tempTargets); setShowTargetsEdit(false); }}
              className="w-full mt-6 py-3 bg-[#00e5ff] hover:bg-[#00cce6] text-[#05181a] rounded-xl text-sm font-bold transition shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              Save Targets
            </button>
          </div>
        </div>
      )}

      {/* Full Insights Modal */}
      {showFullInsights && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1418] border border-white/10 rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400"/> Full AI Insights</h3>
              <button onClick={() => setShowFullInsights(false)} className="text-slate-400 hover:text-white transition p-1"><X className="w-5 h-5" /></button>
            </div>
            {loadingInsights ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#111e22] p-4 rounded-2xl border border-white/5">
                  <p className="text-sm text-slate-300 leading-relaxed">{aiInsights?.summary || "No insights generated yet. Keep tracking data!"}</p>
                </div>
                {aiInsights?.recommendations && aiInsights.recommendations.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recommendations</h4>
                    <div className="grid gap-3">
                      {aiInsights.recommendations.map((rec: any, i: number) => (
                        <div key={i} className="bg-[#111e22] p-4 rounded-2xl border border-white/5">
                          <p className="text-sm font-bold text-[#00e5ff] mb-1">{rec.title || `Tip #${i+1}`}</p>
                          <p className="text-xs text-slate-300 leading-relaxed">{rec.body || rec.description || rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button onClick={() => setShowFullInsights(false)} className="w-full mt-6 py-3 bg-[#111e22] hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition">Close</button>
          </div>
        </div>
      )}

    </div>
  );
}
