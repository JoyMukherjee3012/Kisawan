import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { getEnv } from "../lib/env";

type Msg = { role: "user" | "ai"; text: string };

const SEEDS: string[] = [
  "Namaste! I'm Kisawan AI. Ask me about crop disease, hydration tips, weather, or fertilizer guidance.",
];

const VALID_KEYWORDS = [
  "farm", "crop", "soil", "irrigate", "irrigation", "water", "weather", 
  "rain", "temp", "temperature", "sun", "fertilizer", "pesticide", "livestock", 
  "cow", "tractor", "disease", "health", "harvest", "agriculture", "plant", 
  "seed", "weed", "pest", "yield", "agronomy", "scheme", "subsidy", "sand", "clay", "loam"
];

export function ChatbotAssistant() {
  const { GEMINI_API_KEY, WEATHER_API_KEY } = getEnv();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>(SEEDS.map((t) => ({ role: "ai", text: t })));
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Store live weather and soil context to pass to Gemini
  const [liveContext, setLiveContext] = useState<string>("Environment context unavailable.");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [msgs, open]);

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setOpen(true);
      if (e.detail?.prompt) {
        setInput(e.detail.prompt);
      }
    };
    window.addEventListener('open-kisawan-chat', handleOpenChat);
    return () => window.removeEventListener('open-kisawan-chat', handleOpenChat);
  }, []);

  // Attempt to grab live context in the background for the Chatbot
  useEffect(() => {
    if (!WEATHER_API_KEY) return;
    
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // 1. Nominatim Reverse Geocoding
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, { headers: { 'User-Agent': 'Kisawan-AI/1.0' } });
          const geoData = geoRes.ok ? await geoRes.json() : null;
          const locString = geoData ? `${geoData.address.village || geoData.address.town || geoData.address.city}, ${geoData.address.state}` : "Unknown Location";

          // 2. AccuWeather
          const awGeo = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?q=${lat},${lon}&apikey=${WEATHER_API_KEY}`);
          let awString = "Weather unavailable";
          if (awGeo.ok) {
            const awGeoData = await awGeo.json();
            const locationKey = awGeoData.Key;
            const currentUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${WEATHER_API_KEY}&details=true`;
            const currentRes = await fetch(currentUrl);
            if (currentRes.ok) {
              const currentData = await currentRes.json();
              awString = `${currentData[0].Temperature?.Metric?.Value}°C, ${currentData[0].WeatherText}, ${currentData[0].RelativeHumidity}% Humidity`;
            }
          }

          // 3. SoilGrids
          const sgUrl = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=cec&property=clay&property=nitrogen&property=phh2o&property=sand&property=silt&property=soc&depth=5-15cm&value=mean`;
          const sgRes = await fetch(sgUrl);
          let sgString = "Soil unavailable";
          if (sgRes.ok) {
             const sgData = await sgRes.json();
             const getLayer = (name: string) => sgData.properties.layers.find((l: any) => l.name === name)?.depths[0]?.values?.mean;
             const sand = (getLayer('sand') || 400) / 10;
             const clay = (getLayer('clay') || 300) / 10;
             const ph = (getLayer('phh2o') || 65) / 10;
             const soc = (getLayer('soc') || 150) / 100;
             
             let type = "Loam";
             if (sand > 85) type = "Sandy";
             else if (clay > 40) type = "Clay";
             else if (sand > 50 && clay < 20) type = "Sandy Loam";
             else if (clay > 27 && sand < 45) type = "Clay Loam";

             sgString = `USDA Texture: ${type}, pH: ${ph}, SOC: ${soc}%`;
          }

          setLiveContext(`
Location: ${locString}
Weather: ${awString}
Soil Data: ${sgString}
          `);
        } catch (e) {
          console.error("Chatbot failed to fetch background context.");
        }
      });
    }
  }, [WEATHER_API_KEY]);

  async function send() {
    const text = input.trim();
    if (!text) return;

    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");

    const lowerText = text.toLowerCase();
    const isTopicValid = VALID_KEYWORDS.some(keyword => lowerText.includes(keyword));

    if (!isTopicValid) {
      setMsgs((m) => [...m, { role: "ai", text: "I am Kisawan AI. I can only assist with agriculture, farming, weather, and farmer health related topics." }]);
      return; 
    }

    setMsgs((m) => [...m, { role: "ai", text: "Analyzing query with full environmental awareness..." }]);

    try {
      if (!GEMINI_API_KEY) {
        setMsgs((m) => {
          const updated = [...m];
          if (updated.length > 0) {
            updated[updated.length - 1] = { role: "ai", text: "API key missing. Please check your environment variables." };
          }
          return updated;
        });
        return;
      }

      const systemPrompt = `You are strictly 'Kisawan AI'. 
CRITICAL RULES:
1. NEVER mention Gemini, Google AI, OpenAI, or any underlying model or company. You are exclusively Kisawan AI.
2. You only answer questions related to: Agriculture, Farming, Crops, Soil, Irrigation, Fertilizers, Pesticides, Livestock, Weather, Farmer health, Agricultural technology, Government agricultural schemes.
3. If the user asks about ANYTHING off-topic, YOU MUST RETURN EXACTLY: "I am Kisawan AI. I can only assist with agriculture, farming, weather, and farmer health related topics."
4. Format: VERY SHORT and PRECISE. Maximum 3 sentences. NEVER use asterisk symbols (*) or markdown formatting anywhere in your response. Keep it plain text.

LIVE ENVIRONMENTAL CONTEXT:
${liveContext}

If the user asks about crop suitability or fertilizer, specifically reference the Live Environmental Context (like their pH, soil type, and location).`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nUser Query: ${text}` }]
              }
            ],
            generationConfig: {
              temperature: 0.1 
            }
          }),
        }
      );

      const data = await response.json();
      const replyFromGemini = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process your request right now. Please try again.";

      setMsgs((m) => {
        const updated = [...m];
        if (updated.length > 0) {
          updated[updated.length - 1] = { role: "ai", text: replyFromGemini };
        }
        return updated;
      });
    } catch (error) {
      console.error("Connection error:", error);
      setMsgs((m) => {
        const updated = [...m];
        if (updated.length > 0) {
          updated[updated.length - 1] = { role: "ai", text: "Network connection dropped. Try again soon." };
        }
        return updated;
      });
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Kisawan AI"
        className="fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-neon glow-green animate-pulse-glow transition-transform hover:scale-110 sm:bottom-6 sm:right-6"
      >
        {open ? <X className="h-6 w-6 text-primary-foreground" /> : <Bot className="h-6 w-6 text-primary-foreground" />}
      </button>

      {open && (
        <div className="fixed inset-x-3 bottom-24 z-[55] sm:inset-x-auto sm:right-6 sm:w-[380px] animate-fade-up">
          <div className="glass-solid flex h-[min(70vh,520px)] flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cool">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">Kisawan AI</p>
                <p className="truncate text-xs text-muted-foreground">Online · Farming + Health</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] break-words rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "bg-neon text-primary-foreground" : "border border-white/10 bg-white/[0.07] text-foreground"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="sticky bottom-0 flex items-center gap-2 border-t border-white/10 bg-background/40 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Kisawan AI…"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                aria-label="Send"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neon text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
