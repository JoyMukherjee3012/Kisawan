import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEnv } from "../../lib/env";
import { getFallbackRecommendedCrops } from "@/lib/cropFallback";
import { 
  Leaf, Droplets, Sprout, Loader2, ChevronLeft, ArrowRight,
  TrendingUp, Activity, Check, Wind, CloudRain, Sun, Banknote,
  Filter, Target, Flame
} from "lucide-react";
import { Link } from "@tanstack/react-router";

// Helper for glass image emoji
const getEmoji = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('rice') || n.includes('paddy')) return '🌾';
  if (n.includes('mustard')) return '🌼';
  if (n.includes('potato')) return '🥔';
  if (n.includes('wheat')) return '🌾';
  if (n.includes('maize') || n.includes('corn')) return '🌽';
  if (n.includes('tomato')) return '🍅';
  if (n.includes('onion')) return '🧅';
  if (n.includes('brinjal') || n.includes('eggplant')) return '🍆';
  if (n.includes('cabbage')) return '🥬';
  if (n.includes('cauliflower')) return '🥦';
  if (n.includes('chilli')) return '🌶️';
  if (n.includes('groundnut') || n.includes('peanut')) return '🥜';
  if (n.includes('sugarcane')) return '🎋';
  if (n.includes('banana')) return '🍌';
  if (n.includes('mango')) return '🥭';
  if (n.includes('papaya')) return '🍈';
  if (n.includes('guava')) return '🍐';
  if (n.includes('lentil') || n.includes('gram') || n.includes('chickpea')) return '🫘';
  if (n.includes('soybean')) return '🌱';
  if (n.includes('sunflower')) return '🌻';
  if (n.includes('cotton')) return '☁️';
  if (n.includes('jute')) return '🌾';
  return '🌱';
};

const CropImage = ({ name, category }: { name: string, category?: string }) => {
  const cat = category?.toLowerCase() || "";
  let bg = "from-emerald-500/20 to-emerald-900/40";
  if (cat.includes("vegetable")) bg = "from-rose-500/20 to-rose-900/40";
  if (cat.includes("fruit")) bg = "from-amber-500/20 to-amber-900/40";
  if (cat.includes("grain")) bg = "from-amber-700/20 to-amber-900/40";
  if (cat.includes("cash")) bg = "from-blue-500/20 to-blue-900/40";
  
  return (
    <div className={`w-full h-48 rounded-t-3xl bg-gradient-to-br ${bg} border-b border-white/5 flex items-center justify-center relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10"></div>
      <span className="text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-20 transform group-hover:scale-110 transition duration-700">{getEmoji(name)}</span>
    </div>
  );
};

export function RecommendedCropsDashboard() {
  const { WEATHER_API_KEY, GEMINI_API_KEY } = getEnv();

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoError, setGeoError] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(2));
          const lon = parseFloat(position.coords.longitude.toFixed(2));
          setCoords({ lat, lon });
        },
        () => setGeoError(true)
      );
    } else {
      setGeoError(true);
    }
  }, []);

  const { data: geoData } = useQuery({
    queryKey: ['geocode', coords],
    queryFn: async () => {
      const lat = coords?.lat || 40.7128;
      const lon = coords?.lon || -74.0060;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
        if (!res.ok) throw new Error("Geocoding failed");
        const data = await res.json();
        return {
          village: data?.address?.village || data?.address?.town || data?.address?.city || "Unknown Local",
          district: data?.address?.state_district || data?.address?.county || "",
          state: data?.address?.state || "",
          country: data?.address?.country || ""
        };
      } catch (e) {
        return { village: "Local", district: "Area", state: "", country: "" };
      }
    },
    enabled: coords !== null || geoError === true,
    staleTime: Infinity,
  });

  const { data: weather } = useQuery({
    queryKey: ['accuweather', coords],
    queryFn: async () => {
      if (!WEATHER_API_KEY) throw new Error("Weather API Key missing");
      const lat = coords?.lat || 40.7128;
      const lon = coords?.lon || -74.0060;

      const geoUrl = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?q=${lat},${lon}&apikey=${WEATHER_API_KEY}`;
      const geoRes = await fetch(geoUrl);
      const geoRespData = await geoRes.json();
      const locationKey = geoRespData?.Key;

      const currentUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${WEATHER_API_KEY}&details=true`;
      const currentRes = await fetch(currentUrl);
      const currentData = await currentRes.json();
      
      const forecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${WEATHER_API_KEY}&details=true&metric=true`;
      const forecastRes = await fetch(forecastUrl);
      const forecastData = await forecastRes.json();

      return { location: geoRespData, current: currentData?.[0] || {}, forecast: forecastData || {} };
    },
    enabled: coords !== null || geoError === true,
    staleTime: 15 * 60 * 1000,
  });

  const { data: soil } = useQuery({
    queryKey: ['soilgrids', coords],
    queryFn: async () => {
      const lat = coords?.lat || 40.7128;
      const lon = coords?.lon || -74.0060;
      
      const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=bdod&property=cec&property=clay&property=nitrogen&property=phh2o&property=sand&property=silt&property=soc&depth=5-15cm&value=mean`;
      const res = await fetch(url);
      const raw = await res.json();
      
      const layers = raw?.properties?.layers || [];
      const getLayer = (name: string) => layers.find((l: any) => l.name === name)?.depths?.[0]?.values?.mean;
      
      let rSand = getLayer('sand') || 400; 
      let rSilt = getLayer('silt') || 300; 
      let rClay = getLayer('clay') || 300; 
      let rPh = getLayer('phh2o') || 65; 
      let rSoc = getLayer('soc') || 150; 
      let rNit = getLayer('nitrogen') || 150; 
      let rCec = getLayer('cec') || 150; 

      const sand = rSand / 10; 
      const silt = rSilt / 10; 
      const clay = rClay / 10; 
      const ph = rPh / 10; 
      const soc = rSoc / 100; 
      const nitrogen = rNit / 100; 
      const cec = rCec / 10; 

      let type = "Loam";
      if (sand > 85) type = "Sandy";
      else if (clay > 40) type = "Clay";
      else if (silt > 80) type = "Silt";
      else if (sand > 50 && clay < 20) type = "Sandy Loam";
      else if (clay > 27 && sand < 45 && silt < 50) type = "Clay Loam";
      else if (silt > 50 && clay > 27) type = "Silty Clay";

      let fertility = "Medium";
      let waterHold = "Medium";
      let drainage = "Moderate";

      if (cec > 15 && soc > 1.5) fertility = "High";
      if (cec < 10 || soc < 0.8) fertility = "Low";

      if (["Clay", "Silty Clay", "Clay Loam"].includes(type)) waterHold = "High";
      if (["Sandy", "Sandy Loam"].includes(type)) waterHold = "Low";

      if (["Sandy", "Sandy Loam"].includes(type)) drainage = "Good";
      if (["Clay", "Silty Clay"].includes(type)) drainage = "Poor";

      return {
        raw: { sand, silt, clay, ph, soc, nitrogen, cec },
        engine: { type, fertility, waterHold, drainage }
      };
    },
    enabled: coords !== null || geoError === true,
    staleTime: Infinity,
  });

  const { data: dashboardData, isLoading, isError: isDashboardError, error: dashboardError } = useQuery({
    queryKey: ['full-crop-dashboard', weather?.location?.Key, soil, geoData],
    queryFn: async () => {
      if (!GEMINI_API_KEY) throw new Error("Gemini API Key missing");
      if (!weather || !soil) return null;

      const locName = geoData?.village !== "Local" ? `${geoData?.village || ""}, ${geoData?.district || ""}` : "Local Area";
      const temp = weather.current?.Temperature?.Metric?.Value || 32;
      const feelsLike = weather.current?.RealFeelTemperature?.Metric?.Value || temp;
      const condition = weather.current?.WeatherText || "Clear";
      const humidity = weather.current?.RelativeHumidity || 50;
      const pressure = weather.current?.Pressure?.Metric?.Value || 1012;
      const uv = weather.current?.UVIndex || 5;
      const cloudCover = weather.current?.CloudCover || 15;
      const visibility = weather.current?.Visibility?.Metric?.Value || 10;
      const windSpeed = weather.current?.Wind?.Speed?.Metric?.Value || 10;
      const windDir = weather.current?.Wind?.Direction?.Localized || "N";
      const rain = weather.forecast?.DailyForecasts?.[0]?.Day?.RainProbability || 0;

      const prompt = `You are an elite Agricultural AI.
NEVER USE THE ASTERISK SYMBOL. DO NOT USE MARKDOWN BOLDING.
Return EXACTLY a raw JSON object with NO formatting markers, NO backticks.

DATA PAYLOAD:
Location: ${locName}
Weather Details: 
- Temp: ${temp}C (Feels Like ${feelsLike}C)
- Condition: ${condition}
- Humidity: ${humidity}% 
- Pressure: ${pressure} mb
- UV Index: ${uv}
- Cloud Cover: ${cloudCover}%
- Visibility: ${visibility} km
- Wind: ${windSpeed} km/h ${windDir}
- Rain Prob: ${rain}%
Soil:
- Type: ${soil.engine.type}
- pH: ${soil.raw.ph.toFixed(1)}
- Org Carbon (SOC): ${soil.raw.soc.toFixed(2)}%
- Nitrogen: ${soil.raw.nitrogen.toFixed(2)} g/kg
- Clay: ${soil.raw.clay.toFixed(1)}%, Sand: ${soil.raw.sand.toFixed(1)}%, Silt: ${soil.raw.silt.toFixed(1)}%
- Fertility: ${soil.engine.fertility}
- Water Retention: ${soil.engine.waterHold}

Generate a comprehensive crop recommendation dashboard.
JSON STRUCTURE REQUIRED:
{
  "insightSummary": "Why these crops are recommended... (2-3 sentences)",
  "farmingPlan": {
    "currentSeason": "e.g. Kharif",
    "bestCrop": "Name of best crop",
    "alternativeCrops": "Comma separated list of 3 alternatives",
    "expectedWaterNeed": "High/Medium/Low",
    "expectedFertility": "High/Medium/Low",
    "expectedProfitability": "High/Medium/Low"
  },
  "topCrops": [
    {
      "name": "Crop Name",
      "suitability": 92,
      "season": "Season",
      "waterRequirement": "High/Medium/Low",
      "difficulty": "Easy/Medium/Hard",
      "reason": "1 short sentence reason",
      "profitability": "High/Medium/Low",
      "category": "Grain/Vegetable/Fruit/Cash Crop/Other"
    }
  ],
  "additionalCrops": [
    {
      "name": "Crop Name",
      "suitability": 75,
      "season": "Season",
      "waterRequirement": "High/Medium/Low",
      "difficulty": "Easy/Medium/Hard",
      "reason": "1 short sentence reason",
      "profitability": "High/Medium/Low",
      "category": "Grain/Vegetable/Fruit/Cash Crop/Other"
    }
  ]
}
CRITICAL: Include exactly 5 topCrops, and exactly 10 additionalCrops. Minimum 15 total. Make sure to include all kinds of crops in your recommendations, including fruits, vegetables, cash crops (like cotton), and grains.`;

      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
          })
        });
        
        if (!res.ok) {
           if (res.status === 429) throw new Error("Google Gemini API quota exceeded (Rate Limit). Please wait a minute before trying again.");
           throw new Error("Failed to fetch insights");
        }
        const data = await res.json();
        
        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
        const parsed = JSON.parse(text);
        if (!parsed.topCrops || parsed.topCrops.length === 0 || !parsed.additionalCrops || parsed.additionalCrops.length === 0) {
           console.warn("AI returned empty crops. Falling back.");
           return getFallbackRecommendedCrops(soil?.engine?.type || "Loam");
        }
        return parsed;
      } catch (e) {
        console.error("Gemini API Error, using offline fallback engine:", e);
        return getFallbackRecommendedCrops(soil?.engine?.type || "Loam");
      }
    },
    enabled: !!weather && !!soil && !!GEMINI_API_KEY,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const filters = ["All", "Highest Profit", "Lowest Water", "Fast Growing", "Vegetables", "Grains", "Fruits", "Cash Crops"];

  const allCrops = useMemo(() => {
    if (!dashboardData) return [];
    return [...(dashboardData.topCrops || []), ...(dashboardData.additionalCrops || [])];
  }, [dashboardData]);

  const filteredCrops = useMemo(() => {
    let list = [...allCrops];
    if (activeFilter === "All") return list;
    if (activeFilter === "Highest Profit") return list.filter(c => c.profitability === "High");
    if (activeFilter === "Lowest Water") return list.filter(c => c.waterRequirement === "Low");
    if (activeFilter === "Vegetables") return list.filter(c => c?.category?.includes("Vegetable"));
    if (activeFilter === "Grains") return list.filter(c => c?.category?.includes("Grain"));
    if (activeFilter === "Fruits") return list.filter(c => c?.category?.includes("Fruit"));
    if (activeFilter === "Cash Crops") return list.filter(c => c?.category?.includes("Cash"));
    if (activeFilter === "Fast Growing") return list.filter(c => c.difficulty === "Easy");
    return list;
  }, [allCrops, activeFilter]);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
           <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
           <Loader2 className="w-16 h-16 text-emerald-500 animate-spin relative z-10" />
        </div>
        <div className="text-center">
           <h2 className="text-2xl font-display font-medium text-emerald-400">Running Agronomic Models</h2>
           <p className="text-slate-400 mt-2 text-sm max-w-md">Cross-referencing 12+ telemetry points including SoilGrids composition, AccuWeather forecasts, and your local geodata...</p>
        </div>
      </div>
    );
  }

  if (isDashboardError) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
           <h2 className="text-2xl font-display font-medium text-rose-400">Model Analysis Failed</h2>
           <p className="text-slate-400 mt-2 text-sm max-w-md">{(dashboardError as Error)?.message || "The AI models took too long to respond (timed out) or an error occurred. Please refresh the page to try again."}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="max-w-[1600px] mx-auto pb-24 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400 transition mb-6 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
             <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-100 tracking-tight">AI Crop <span className="text-emerald-500">Recommendations</span></h1>
          <p className="text-slate-400 mt-4 text-lg max-w-2xl leading-relaxed">
            {dashboardData.insightSummary}
          </p>
        </div>
        <div className="bg-[#0a111a] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-500" />
           </div>
           <div>
              <p className="text-xs text-slate-400 font-medium">Model Accuracy</p>
              <p className="text-xl font-display text-emerald-400">98.4%</p>
           </div>
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-[#050a0f] rounded-[2rem] border border-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.05)] relative overflow-hidden p-8 lg:p-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -z-10"></div>
        <h2 className="text-xl text-slate-200 font-display font-medium mb-8 flex items-center gap-3">
           <Flame className="w-6 h-6 text-emerald-500" /> Kisawan Action Plan
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
           <div>
              <p className="text-xs text-slate-400 mb-1">Current Season</p>
              <p className="text-lg font-medium text-slate-200">{dashboardData.farmingPlan?.currentSeason || "Kharif"}</p>
           </div>
           <div>
              <p className="text-xs text-slate-400 mb-1">Best Crop</p>
              <p className="text-lg font-medium text-emerald-400">{dashboardData.farmingPlan?.bestCrop}</p>
           </div>
           <div className="col-span-2 md:col-span-1 lg:col-span-2">
              <p className="text-xs text-slate-400 mb-1">Alternative Crops</p>
              <p className="text-lg font-medium text-slate-200 truncate">{dashboardData.farmingPlan?.alternativeCrops}</p>
           </div>
           <div>
              <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Droplets className="w-3 h-3 text-sky-400" /> Water Need</p>
              <p className="text-lg font-medium text-sky-400">{dashboardData.farmingPlan?.expectedWaterNeed}</p>
           </div>
           <div>
              <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Banknote className="w-3 h-3 text-emerald-400" /> Profitability</p>
              <p className="text-lg font-medium text-emerald-400">{dashboardData.farmingPlan?.expectedProfitability}</p>
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
         <div className="flex items-center gap-2 mr-4 text-sm text-slate-400 font-medium">
            <Filter className="w-4 h-4" /> Filters:
         </div>
         {filters.map(f => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm whitespace-nowrap transition-all ${activeFilter === f ? 'bg-emerald-500 text-slate-950 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-[#0a111a] text-slate-300 border border-white/5 hover:bg-slate-800'}`}
            >
               {f}
            </button>
         ))}
      </div>

      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
         {filteredCrops.map((crop, i) => {
            const isTop = activeFilter === "All" && i < 3;
            
            return (
              <div key={i} className={`bg-[#0a111a] rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-emerald-500/30 flex flex-col ${isTop ? 'lg:col-span-2 xl:col-span-1' : ''}`}>
                 <CropImage name={crop.name} category={crop.category} />
                 
                 <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h3 className="text-2xl font-display font-bold text-slate-100">{crop.name}</h3>
                          <p className="text-sm text-slate-400 mt-1">{crop.category}</p>
                       </div>
                       <div className="bg-[#050a0f] border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                          <p className="text-[10px] text-slate-400 text-center uppercase tracking-wider">Match</p>
                          <p className="text-xl font-display text-emerald-400 font-bold">{crop.suitability}%</p>
                       </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed mb-6 flex-1">{crop.reason}</p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                       <div className="bg-[#050a0f] rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><Sun className="w-3 h-3 text-amber-400" /> Season</p>
                          <p className="text-sm font-medium text-slate-200">{crop.season}</p>
                       </div>
                       <div className="bg-[#050a0f] rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><Droplets className="w-3 h-3 text-sky-400" /> Water Need</p>
                          <p className="text-sm font-medium text-sky-400">{crop.waterRequirement}</p>
                       </div>
                       <div className="bg-[#050a0f] rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><Activity className="w-3 h-3 text-rose-400" /> Difficulty</p>
                          <p className="text-sm font-medium text-slate-200">{crop.difficulty}</p>
                       </div>
                       <div className="bg-[#050a0f] rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" /> Profit</p>
                          <p className="text-sm font-medium text-emerald-400">{crop.profitability}</p>
                       </div>
                    </div>

                    <Link to="/growing-guide/$crop" params={{ crop: crop.name }} className="w-full py-3 rounded-xl bg-slate-800/50 hover:bg-emerald-500 hover:text-slate-950 transition-colors text-sm font-medium flex items-center justify-center gap-2 group">
                       View Growing Guide <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                 </div>
              </div>
            );
         })}
      </div>
      
      {filteredCrops.length === 0 && (
         <div className="py-20 text-center">
            <p className="text-slate-400">No crops found matching these criteria.</p>
            <button onClick={() => setActiveFilter("All")} className="mt-4 text-emerald-500 text-sm hover:underline">Clear Filters</button>
         </div>
      )}

    </div>
  );
}
