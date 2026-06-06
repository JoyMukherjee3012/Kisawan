import { CloudRain, Droplets, FlaskConical, Leaf, Sprout, Upload, Loader2, HelpCircle, Check, ChevronRight, Sparkles, Bell } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState, useEffect } from "react";
import { Clock, TrendingUp, TestTube, MapPin, AlertCircle, Activity, Wind, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getEnv } from "../../lib/env";
import { WeatherWidget, HumidityWidget, SoilScoreWidget, WindWidget, DirectionWidget } from "./AnimatedWidgets";
import { getFallbackDashboardData } from "@/lib/cropFallback";

export function CropHealth() {
  const { GEMINI_API_KEY, WEATHER_API_KEY } = getEnv();

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoError, setGeoError] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !GEMINI_API_KEY) return;

    setIsScanning(true);
    setScanResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = (reader.result as string).split(',')[1];
        
        const prompt = `You are Kisawan AI, an expert plant pathologist. 
Analyze this image of a plant/leaf. 
1. Identify the crop.
2. Detect any diseases, pests, or nutrient deficiencies.
3. Provide a very short, precise diagnosis.
4. Give max 3 actionable treatment steps as extremely short bullet points.
Keep the response under 50 words total. Return plain text only, no markdown formatting. Be direct and concise.`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: prompt },
                    {
                      inlineData: {
                        mimeType: file.type,
                        data: base64Image
                      }
                    }
                  ]
                }
              ],
              generationConfig: { temperature: 0.2 }
            })
          }
        );

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to analyze image.";
        setScanResult(text);
        setIsScanning(false);
      };
    } catch (err) {
      setScanResult("An error occurred during the scan. Please try again.");
      setIsScanning(false);
    }
  };

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
          country: data?.address?.country || "",
          displayName: data?.display_name || "Unknown Area"
        };
      } catch (e) {
        return { village: "Local", district: "Area", state: "", country: "", displayName: "Local Area" };
      }
    },
    enabled: coords !== null || geoError === true,
    staleTime: Infinity,
  });

  const { data: weather, isLoading: weatherLoading, isError: isWeatherError } = useQuery({
    queryKey: ['accuweather', coords],
    queryFn: async () => {
      if (!WEATHER_API_KEY) throw new Error("Weather API Key missing");
      const lat = coords?.lat || 40.7128;
      const lon = coords?.lon || -74.0060;

      const geoUrl = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?q=${lat},${lon}&apikey=${WEATHER_API_KEY}`;
      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) throw new Error("AccuWeather Geoposition failed");
      const geoRespData = await geoRes.json();
      const locationKey = geoRespData?.Key;
      if (!locationKey) throw new Error("Invalid AccuWeather Key");

      const currentUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${WEATHER_API_KEY}&details=true`;
      const currentRes = await fetch(currentUrl);
      if (!currentRes.ok) throw new Error("AccuWeather Current Conditions failed");
      const currentData = await currentRes.json();
      
      const forecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${WEATHER_API_KEY}&details=true&metric=true`;
      const forecastRes = await fetch(forecastUrl);
      if (!forecastRes.ok) throw new Error("AccuWeather Forecast failed");
      const forecastData = await forecastRes.json();

      return { location: geoRespData, current: currentData?.[0] || {}, forecast: forecastData || {} };
    },
    enabled: coords !== null || geoError === true,
    refetchInterval: 15 * 60 * 1000,
  });

  const { data: soil, isLoading: soilLoading, isError: isSoilError } = useQuery({
    queryKey: ['soilgrids', coords],
    queryFn: async () => {
      const lat = coords?.lat || 40.7128;
      const lon = coords?.lon || -74.0060;
      
      const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=bdod&property=cec&property=clay&property=nitrogen&property=phh2o&property=sand&property=silt&property=soc&depth=5-15cm&value=mean`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("SoilGrids API failed");
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
      let fertilityScore = "Moderate";
      if (cec > 20 && soc > 2) { fertility = "Very High"; fertilityScore = "Excellent"; }
      else if (cec > 15 && soc > 1.5) { fertility = "High"; fertilityScore = "Good"; }
      else if (cec < 10 || soc < 0.8) { fertility = "Low"; fertilityScore = "Poor"; }
      else if (cec < 5) { fertility = "Very Low"; fertilityScore = "Critical"; }

      let waterHold = "Medium";
      if (["Clay", "Silty Clay", "Clay Loam"].includes(type)) waterHold = "High";
      if (["Sandy", "Sandy Loam"].includes(type)) waterHold = "Low";

      let drainage = "Moderate";
      if (["Sandy", "Sandy Loam"].includes(type)) drainage = "Good";
      if (["Clay", "Silty Clay"].includes(type)) drainage = "Poor";

      let score = 50;
      if (ph >= 6.0 && ph <= 7.5) score += 20;
      if (soc > 1.5) score += 15;
      if (cec > 15) score += 15;

      return {
        raw: { sand, silt, clay, ph, soc, nitrogen, cec },
        engine: { type, fertility, fertilityScore, waterHold, drainage, score }
      };
    },
    enabled: coords !== null || geoError === true,
    staleTime: Infinity,
  });

  const { data: insights, isError: isInsightsError, error: insightsError } = useQuery({
    queryKey: ['farming-advisor', weather?.location?.Key, soil, geoData],
    queryFn: async () => {
      if (!GEMINI_API_KEY) throw new Error("Gemini API Key missing");
      if (!weather || !soil) return null;

      const locName = geoData?.village !== "Local" ? `${geoData?.village || ""}, ${geoData?.district || ""}` : "Local Area";

      const prompt = `KISAWAN AI ANALYSIS PROMPT

You are Kisawan AI, an agricultural intelligence system.

IMPORTANT RULES
* Generate all outputs in a single response.
* Never use "*" symbols.
* Never use markdown.
* Use simple farmer-friendly language.
* Keep answers practical and actionable.
* Do not mention AI models, Gemini, Google, APIs, or technical details.

INPUT DATA
Location:
${locName}

Weather:
Temperature: ${weather.current?.Temperature?.Metric?.Value || 32}°C
Humidity: ${weather.current?.RelativeHumidity || 50}%
Wind Speed: ${weather.current?.Wind?.Speed?.Metric?.Value || 10} km/h
Rain Probability: ${weather.forecast?.DailyForecasts?.[0]?.Day?.RainProbability || 0}%
Weather Condition: ${weather.current?.WeatherText || "Clear"}
Forecast: ${weather.forecast?.Headline?.Text || "Normal conditions"}

Soil Data:
Soil Type: ${soil.engine.type}
pH: ${soil.raw.ph.toFixed(1)}
Organic Carbon: ${soil.raw.soc.toFixed(2)}%
Nitrogen: ${soil.raw.nitrogen.toFixed(2)} g/kg
Clay: ${soil.raw.clay.toFixed(1)}%
Sand: ${soil.raw.sand.toFixed(1)}%
Silt: ${soil.raw.silt.toFixed(1)}%
CEC: ${soil.raw.cec.toFixed(1)} cmol/kg
Water Holding Capacity: ${soil.engine.waterHold}
Drainage Quality: ${soil.engine.drainage}
Fertility Rating: ${soil.engine.fertility}
Soil Health Score: ${soil.engine.score}

TASKS
Generate all of the following:

1. Soil Summary
Give a short summary of:
* Soil type
* Fertility
* Water retention
* Soil health
Maximum 2 sentences.

2. Best Crops
CRITICAL: You MUST recommend EXACTLY 5 best crops. No more, no less.
For each crop provide:
Crop Name
Suitability Percentage
Short Reason
Example:
Rice
Suitability: 92%
Reason: High moisture retention and suitable rainfall.

3. Irrigation Recommendation
Provide:
* Irrigation Needed (Yes/No)
* Recommended Amount
* Recommended Time
* Recommended Method
* Reason
Maximum 4 sentences.

4. Fertilizer Recommendation
Provide:
* Soil fertility status
* Main nutrient concerns
* Organic recommendation
* Chemical fertilizer recommendation
Maximum 5 sentences.

5. AI Alerts
Check for:
* Heat stress
* Drought risk
* Waterlogging risk
* Strong wind risk
* Disease risk
* Low fertility risk
For each detected risk provide:
Risk Level
Action Required

6. Dashboard Summary
Generate a single short summary for dashboard cards.
Maximum 25 words.

OUTPUT FORMAT
Return ONLY valid JSON.
{
"soilSummary": "",
"dashboardSummary": "",
"topCrops": [
{
"crop": "",
"score": 0,
"reason": ""
}
],
"irrigation": {
"needed": "",
"amount": "",
"time": "",
"method": "",
"reason": ""
},
"fertilizer": {
"status": "",
"organic": "",
"chemical": "",
"notes": ""
},
"alerts": [
{
"risk": "",
"level": "",
"action": ""
}
]
}

CRITICAL
Return JSON only.
No markdown.
No code blocks.
No asterisks.
No explanations outside JSON.`;

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
        if (!parsed.topCrops || parsed.topCrops.length === 0) {
           console.warn("AI returned empty crops. Falling back.");
           return getFallbackDashboardData(soil?.engine?.type || "Loam");
        }
        return parsed;
      } catch (e) {
        console.error("Gemini API Error, using offline fallback engine:", e);
        return getFallbackDashboardData(soil?.engine?.type || "Loam");
      }
    },
    enabled: !!weather && !!soil && !!geoData,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // UI Safe Bindings
  const currentTemp = weather?.current?.Temperature?.Metric?.Value ? `${Math.round(weather.current.Temperature.Metric.Value)}°C` : "32°C";
  const feelsLike = weather?.current?.RealFeelTemperature?.Metric?.Value ? `${Math.round(weather.current.RealFeelTemperature.Metric.Value)}°C` : "32°C";
  const currentCondition = weather?.current?.WeatherText || "Partly cloudy";
  const currentWind = weather?.current?.Wind?.Speed?.Metric?.Value ? String(Math.round(weather.current.Wind.Speed.Metric.Value)) : "12";
  const windDirection = weather?.current?.Wind?.Direction?.Localized || "N";
  const humidity = weather?.current?.RelativeHumidity ? String(weather.current.RelativeHumidity) : "46";
  const uv = weather?.current?.UVIndex ? String(weather.current.UVIndex) : "5";
  const visibility = weather?.current?.Visibility?.Metric?.Value ? `${weather.current.Visibility.Metric.Value} km` : "10 km";
  const pressure = weather?.current?.Pressure?.Metric?.Value ? `${weather.current.Pressure.Metric.Value} mb` : "1012 mb";
  const cloudCover = weather?.current?.CloudCover ? `${weather.current.CloudCover}%` : "15%";
  
  const rainProb = weather?.forecast?.DailyForecasts?.[0]?.Day?.RainProbability ? `${weather.forecast.DailyForecasts[0].Day.RainProbability}%` : "10%";
  const sunrise = weather?.forecast?.DailyForecasts?.[0]?.Sun?.Rise ? new Date(weather.forecast.DailyForecasts[0].Sun.Rise).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "06:00 AM";
  const sunset = weather?.forecast?.DailyForecasts?.[0]?.Sun?.Set ? new Date(weather.forecast.DailyForecasts[0].Sun.Set).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "06:00 PM";
  
  const locationName = geoData?.village !== "Local" ? `${geoData?.village || ""}, ${geoData?.district || ""}` : weather?.location?.LocalizedName || "Local Forecast";

  const dynamicSoilData = soil?.raw ? [
    { n: "Sand", v: Math.round(soil.raw.sand || 0) },
    { n: "Silt", v: Math.round(soil.raw.silt || 0) },
    { n: "Clay", v: Math.round(soil.raw.clay || 0) },
    { n: "pH", v: Math.round((soil.raw.ph || 6.8) * 10) }, 
    { n: "SOC", v: Math.round((soil.raw.soc || 1.5) * 10) }, 
  ] : [
    { n: "Sand", v: 45 }, { n: "Silt", v: 30 }, { n: "Clay", v: 25 },
    { n: "pH", v: 68 }, { n: "SOC", v: 15 },
  ];

  const getEmoji = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('rice') || n.includes('paddy')) return '🌾';
    if (n.includes('mustard')) return '🌼';
    if (n.includes('potato')) return '🥔';
    if (n.includes('wheat')) return '🌾';
    if (n.includes('maize') || n.includes('corn')) return '🌽';
    if (n.includes('tomato')) return '🍅';
    if (n.includes('onion')) return '🧅';
    return '🌱';
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN (Main Data) */}
      <div className="xl:col-span-8 space-y-6">

         {/* Animated Widgets Row */}
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <WeatherWidget temp={currentTemp} text={currentCondition} />
            <HumidityWidget value={humidity} />
            <SoilScoreWidget score={soil?.engine?.score?.toString() || "88"} />
            <WindWidget speed={currentWind} />
            <DirectionWidget direction={windDirection} />
         </div>

         {/* Bottom Row */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-3xl p-8 min-h-[240px] border-white/5 flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/20"><Leaf className="h-5 w-5 text-emerald-400" /></div>
                  <div>
                    <h3 className="font-display text-base font-semibold">Disease Scan</h3>
                    <p className="text-xs text-muted-foreground">Upload a leaf photo</p>
                  </div>
                </div>
              </div>
              
              {scanResult ? (
                <div className="mt-4 flex-1 overflow-y-auto text-sm text-slate-200 bg-slate-950/40 p-4 rounded-xl border border-white/10">
                  <p className="whitespace-pre-wrap leading-relaxed">{scanResult}</p>
                  <button onClick={() => setScanResult(null)} className="mt-4 text-emerald-400 text-xs font-medium hover:underline flex items-center gap-1">
                    Scan another image
                  </button>
                </div>
              ) : (
                <label className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 py-8 text-center transition-colors hover:border-emerald-500/50 flex-1 mt-4">
                  {isScanning ? (
                     <Loader2 className="mb-2 h-6 w-6 text-emerald-400 animate-spin" />
                  ) : (
                     <Upload className="mb-2 h-6 w-6 text-emerald-400" />
                  )}
                  <p className="text-xs font-medium text-slate-300">{isScanning ? "Analyzing..." : "Drop image or click to upload"}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG · max 10MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleScan} disabled={isScanning} />
                </label>
              )}
            </div>

            <div className="glass rounded-3xl p-8 min-h-[240px] border-white/5 flex flex-col justify-between">
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-sky-500/20"><CloudRain className="h-5 w-5 text-sky-400" /></div>
                    <div>
                      <h3 className="font-display text-base font-semibold">Weather Analysis</h3>
                      <p className="text-xs text-muted-foreground truncate w-[140px]" title={locationName}>{locationName}</p>
                    </div>
                  </div>
                  {weatherLoading && <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />}
                </div>
                
                <div className="grid grid-cols-3 gap-y-4 gap-x-2 rounded-xl bg-slate-950/40 p-4 text-center text-sm border border-white/5 mt-4">
                  <div><p className="text-[10px] text-muted-foreground">Feels Like</p><p className="font-display text-sm font-medium">{feelsLike}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Rain Prob.</p><p className="font-display text-sm font-medium">{rainProb}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">UV Index</p><p className="font-display text-sm font-medium">{uv}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Humidity</p><p className="font-display text-sm font-medium">{humidity}%</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Pressure</p><p className="font-display text-sm font-medium">{pressure}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Visibility</p><p className="font-display text-sm font-medium">{visibility}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Cloud Cover</p><p className="font-display text-sm font-medium">{cloudCover}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Sunrise</p><p className="font-display text-sm font-medium">{sunrise}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Sunset</p><p className="font-display text-sm font-medium">{sunset}</p></div>
                </div>
              </div>

              <div className="mt-4 border-t border-white/5 pt-4">
                 <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider">5-Day Forecast</p>
                 <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {weather?.forecast?.DailyForecasts?.map((day: any, i: number) => (
                       <div key={i} className="flex flex-col items-center min-w-[55px] bg-slate-900/50 p-2 rounded-xl border border-white/5 shrink-0">
                          <span className="text-[10px] text-slate-400 mb-1">{new Date(day.Date).toLocaleDateString('en-US', {weekday:'short'})}</span>
                          <span className="text-sm font-medium text-slate-200">{Math.round(day.Temperature.Maximum.Value)}°</span>
                          <span className="text-[10px] text-slate-500">{Math.round(day.Temperature.Minimum.Value)}°</span>
                       </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-8 min-h-[240px] border-white/5 flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/20"><FlaskConical className="h-5 w-5 text-emerald-400" /></div>
                  <div>
                    <h3 className="font-display text-base font-semibold">Soil Health</h3>
                    <p className="text-xs text-muted-foreground">{soil ? soil.engine.type : "Analyzing..."}</p>
                  </div>
                </div>
              </div>
              <div className="h-48 mt-2 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynamicSoilData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid stroke="oklch(1 0 0 / 0.04)" vertical={false} />
                    <XAxis dataKey="n" stroke="oklch(0.72 0.03 220)" fontSize={9} tickLine={false} axisLine={false} interval={0} angle={-35} textAnchor="end" height={40} dy={15} dx={-2} />
                    <YAxis stroke="oklch(0.72 0.03 220)" fontSize={9} tickLine={false} axisLine={false} width={25} />
                    <Tooltip cursor={{fill: 'oklch(1 0 0 / 0.05)'}} contentStyle={{ background: "oklch(0.19 0.03 230)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                    <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
         </div>
         
         {/* Kisawan AI Soil Analysis Hero Box */}
         <div className="bg-[#050a0f] p-8 rounded-[2rem] border border-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.05)] relative overflow-hidden mt-8">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -z-10"></div>

            <div className="relative z-10">
              <h2 className="text-2xl text-emerald-500 font-display mb-2 font-medium">Kisawan AI Soil Analysis</h2>
              <p className="text-sm text-slate-300 mb-8">Here's what our AI model has discovered...</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div className="bg-[#0a111a] border border-white/5 rounded-3xl p-6 flex justify-between items-center transition hover:bg-[#0f1620]">
                    <div>
                       <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">Overall Soil Health Score <HelpCircle className="w-3.5 h-3.5" /></p>
                       <p className="text-2xl text-emerald-500 font-display">{soilLoading ? "..." : (Number(soil?.engine?.score) > 70 ? "High" : "Moderate")}</p>
                    </div>
                    <Leaf className="w-6 h-6 text-emerald-500 stroke-[1.5]" />
                 </div>
                 
                 <div className="bg-[#0a111a] border border-white/5 rounded-3xl p-6 flex justify-between items-center transition hover:bg-[#0f1620]">
                    <div>
                       <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">Soil Moisture Level <HelpCircle className="w-3.5 h-3.5" /></p>
                       <p className="text-2xl text-amber-500 font-display">{soilLoading ? "..." : soil?.engine?.waterHold}</p>
                    </div>
                    <Droplets className="w-6 h-6 text-sky-500 stroke-[1.5]" />
                 </div>

                 <div className="bg-[#0a111a] border border-white/5 rounded-3xl p-6 flex justify-between items-center transition hover:bg-[#0f1620]">
                    <div>
                       <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">Fertility Rating <HelpCircle className="w-3.5 h-3.5" /></p>
                       <p className="text-2xl text-amber-500 font-display">{soilLoading ? "..." : soil?.engine?.fertility}</p>
                    </div>
                    <Sprout className="w-6 h-6 text-amber-500 stroke-[1.5]" />
                 </div>

                 <div className="bg-[#0a111a] border border-white/5 rounded-3xl p-6 flex justify-between items-center transition hover:bg-[#0f1620]">
                    <div>
                       <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">Soil Texture Type <HelpCircle className="w-3.5 h-3.5" /></p>
                       <p className="text-2xl text-sky-500 font-display">{soilLoading ? "..." : soil?.engine?.type}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 opacity-80">
                       {[...Array(9)].map((_, i) => <div key={i} className="w-[5px] h-[5px] rounded-full bg-sky-500"></div>)}
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 flex justify-center items-center gap-1.5 text-sm text-slate-400">
                 Analysis completed <span className="text-emerald-500 font-medium flex items-center gap-1">successfully <Check className="w-4 h-4 stroke-[2.5]" /></span>
              </div>
            </div>
         </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="xl:col-span-4 space-y-6">
         {/* Stacked Action Buttons */}
         <div className="space-y-3">
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-kisawan-chat', { detail: { prompt: "Generate an irrigation schedule for my field." } }))} className="w-full glass flex items-center justify-between p-4 rounded-2xl border-white/5 hover:bg-slate-800/50 transition active:scale-95 cursor-pointer">
               <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-sky-400" />
                  <div className="text-left">
                     <p className="text-sm font-semibold text-slate-200">Irrigation</p>
                     <p className="text-[10px] text-muted-foreground mt-0.5">Get the best irrigation schedule...</p>
                  </div>
               </div>
               <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-kisawan-chat', { detail: { prompt: "What are the best fertilizer recommendations for my current soil?" } }))} className="w-full glass flex items-center justify-between p-4 rounded-2xl border-white/5 hover:bg-slate-800/50 transition active:scale-95 cursor-pointer">
               <div className="flex items-center gap-3">
                  <FlaskConical className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                     <p className="text-sm font-semibold text-slate-200">Fertilizer Advisor</p>
                     <p className="text-[10px] text-muted-foreground mt-0.5">Get the best fertilizer recommendations...</p>
                  </div>
               </div>
               <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <button onClick={() => window.dispatchEvent(new CustomEvent('open-kisawan-chat', { detail: { prompt: "Are there any farming alerts or tips I should be aware of today?" } }))} className="w-full glass flex items-center justify-between p-4 rounded-2xl border-white/5 hover:bg-slate-800/50 transition active:scale-95 cursor-pointer">
               <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <div className="text-left">
                     <p className="text-sm font-semibold text-slate-200">AI Alerts & Tips</p>
                     <p className="text-[10px] text-muted-foreground mt-0.5">Personalized alerts and farming tips...</p>
                  </div>
               </div>
               <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
         </div>

         {/* Best Crops Progress Bars */}
         <div className="glass-solid rounded-3xl p-6 border-white/5 flex flex-col min-h-[460px]">
            <div className="mb-8">
               <h3 className="font-display text-lg flex items-center gap-2"><Sprout className="w-5 h-5 text-emerald-400" /> Best Crops for Your Soil</h3>
               <p className="text-xs text-slate-400 mt-1">Top crops recommended for {soil?.engine?.type || "your"} soil</p>
            </div>
            
            <div className="space-y-7 flex-1">
               {isInsightsError ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4 pt-10 text-center">
                    <p className="text-sm text-rose-400 font-medium">Model analysis failed.</p>
                    <p className="text-xs text-slate-400">{(insightsError as Error)?.message || "Analysis timed out. Please try again."}</p>
                  </div>
               ) : insights?.topCrops ? insights.topCrops.map((crop: any, i: number) => (
                  <div key={i}>
                     <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-3">
                           <div className="text-xl leading-none drop-shadow-md">{getEmoji(crop.crop)}</div>
                           <span className="text-sm font-medium text-slate-200">{crop.crop}</span>
                        </div>
                        <span className="text-sm font-display font-medium text-slate-300">{crop.score}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${crop.score}%` }}></div>
                     </div>
                  </div>
               )) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4 pt-10">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-sm text-slate-300">Processing agronomic models...</p>
                  </div>
               )}
            </div>

            <Link to="/recommended-crops" className="w-full mt-8 py-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 transition border border-white/5 flex items-center justify-center gap-2 text-xs font-medium text-emerald-400">
              View All Recommended Crops <ChevronRight className="w-3 h-3" />
            </Link>
         </div>
      </div>
    </div>
  );
}
