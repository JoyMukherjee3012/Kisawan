import { useQuery } from "@tanstack/react-query";
import { getEnv } from "../../lib/env";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Calendar, Sprout, Tractor, Coins, Droplets, ShieldAlert, Sparkles, CheckCircle2, FlaskConical, Loader2, Image as ImageIcon, Bug } from "lucide-react";
import { getFallbackGrowingGuide } from "@/lib/cropFallback";

export function GrowingGuide({ crop }: { crop: string }) {
  const { GEMINI_API_KEY } = getEnv();
  const decodedCrop = decodeURIComponent(crop);

  const { data: guide, isLoading } = useQuery({
    queryKey: ['growing-guide', decodedCrop],
    queryFn: async () => {
      if (!GEMINI_API_KEY) throw new Error("Missing API Key");

      const prompt = `You are Kisawan AI.
Generate a complete, structured agricultural growing guide for: ${decodedCrop}
Format exactly as raw JSON with no asterisks or markdown.

{
  "summary": "2 sentences about the crop",
  "totalDuration": "e.g. 120-150 Days",
  "estimatedCostPerAcre": "e.g. ₹15,000 - ₹20,000",
  "idealWaterRequirement": "e.g. 500-700mm",
  "recommendedChemicals": [
    { "name": "e.g. Urea 46% N", "type": "Fertilizer", "purpose": "Boosts vegetative growth" },
    { "name": "e.g. Chlorpyrifos 20% EC", "type": "Insecticide", "purpose": "Controls stem borer" },
    { "name": "e.g. Mancozeb 75% WP", "type": "Fungicide", "purpose": "Prevents leaf blight" }
  ],
  "phases": [
    {
      "phaseName": "1. Sowing & Germination",
      "duration": "Days 0-15",
      "action": "What to do...",
      "waterNeed": "Low/Medium/High"
    }
  ],
  "costBreakdown": [
    { "item": "Seeds", "cost": "₹2,000" }
  ],
  "commonDiseases": ["Disease 1", "Disease 2"]
}
Include exactly 6 to 8 highly detailed phases from beginning to post-harvesting.`;

      async function fetchWikiImage(cropName: string): Promise<string | null> {
        try {
           const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(cropName)}&prop=pageimages&format=json&pithumbsize=800&origin=*`);
           if (wikiRes.ok) {
              const wikiData = await wikiRes.json();
              const pages = wikiData.query?.pages;
              if (pages) {
                 const pageId = Object.keys(pages)[0];
                 if (pages[pageId].thumbnail?.source) {
                    return pages[pageId].thumbnail.source;
                 }
              }
           }
        } catch (e) { console.error("Wiki Image Fetch failed", e); }
        return null;
      }

      let parsed;
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
          })
        });
        
        const data = await res.json();
        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
        parsed = JSON.parse(text);
        if (!parsed.phases || parsed.phases.length === 0) {
           throw new Error("Invalid AI format");
        }
      } catch (e) {
        console.error("Gemini API Error, using offline fallback growing guide:", e);
        parsed = getFallbackGrowingGuide(decodedCrop);
      }

      // Always try to fetch the real Wikipedia image, even if AI failed
      const realImage = await fetchWikiImage(decodedCrop);
      parsed.imageUrl = realImage || `https://placehold.co/800x600/0a111a/10b981?text=${encodeURIComponent(decodedCrop)}`;
      return parsed;
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Link to="/recommended-crops" className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400 transition bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
         <ChevronLeft className="w-4 h-4" /> Back to Recommendations
      </Link>
      
      <div className="bg-[#050a0f] p-8 md:p-12 rounded-[2rem] border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -z-10"></div>
         
         <div className="flex flex-col md:flex-row gap-8 items-start">
           <div className="flex-1">
             <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-100 tracking-tight capitalize">{decodedCrop}</h1>
             <h2 className="text-xl md:text-2xl text-emerald-400 font-display mt-2">A-Z Growing Guide</h2>
             
             {isLoading ? (
                <div className="mt-8 space-y-4">
                   <div className="h-6 w-3/4 bg-white/5 animate-pulse rounded"></div>
                   <div className="h-6 w-1/2 bg-white/5 animate-pulse rounded"></div>
                </div>
             ) : (
                <p className="text-slate-300 mt-6 text-lg max-w-3xl leading-relaxed">{guide?.summary}</p>
             )}
           </div>
           
           <div className="w-full md:w-1/3 aspect-video md:aspect-square lg:aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
             <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center -z-10">
                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
             </div>
             <img 
               src={guide?.imageUrl || `https://placehold.co/800x600/0a111a/10b981?text=${encodeURIComponent(decodedCrop)}`} 
               alt={decodedCrop}
               className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
               onError={(e) => { 
                 if (!e.currentTarget.src.includes('placehold.co')) {
                   e.currentTarget.src = `https://placehold.co/800x600/0a111a/10b981?text=${encodeURIComponent(decodedCrop)}`; 
                 }
               }}
             />
           </div>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="bg-[#0a111a] p-4 rounded-2xl border border-white/5">
               <Calendar className="w-6 h-6 text-emerald-500 mb-3" />
               <p className="text-xs text-slate-400">Total Duration</p>
               {isLoading ? <div className="h-6 w-20 bg-white/5 animate-pulse rounded mt-1"></div> : <p className="text-lg font-bold text-slate-200">{guide?.totalDuration}</p>}
            </div>
            <div className="bg-[#0a111a] p-4 rounded-2xl border border-white/5">
               <Coins className="w-6 h-6 text-emerald-500 mb-3" />
               <p className="text-xs text-slate-400">Est. Cost / Acre</p>
               {isLoading ? <div className="h-6 w-24 bg-white/5 animate-pulse rounded mt-1"></div> : <p className="text-lg font-bold text-slate-200">{guide?.estimatedCostPerAcre}</p>}
            </div>
            <div className="bg-[#0a111a] p-4 rounded-2xl border border-white/5 md:col-span-2">
               <Droplets className="w-6 h-6 text-sky-500 mb-3" />
               <p className="text-xs text-slate-400">Ideal Water Requirement</p>
               {isLoading ? <div className="h-6 w-32 bg-white/5 animate-pulse rounded mt-1"></div> : <p className="text-lg font-bold text-slate-200">{guide?.idealWaterRequirement || "Moderate"}</p>}
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
               <Sprout className="w-6 h-6 text-emerald-500" /> Cultivation Timeline
            </h3>

            {isLoading ? (
               <div className="space-y-4">
                  {[1,2,3,4].map(i => (
                     <div key={i} className="bg-[#0a111a] p-6 rounded-3xl border border-white/5 h-32 animate-pulse flex items-center">
                        <Loader2 className="w-8 h-8 text-emerald-500/50 animate-spin ml-4" />
                        <div className="ml-6 space-y-3 flex-1">
                           <div className="h-5 w-1/3 bg-white/5 rounded"></div>
                           <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="space-y-4">
                  {guide?.phases?.map((phase: any, i: number) => (
                     <div key={i} className="bg-[#0a111a] p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500/50"></div>
                        <div className="flex flex-col">
                           <div>
                              <p className="text-emerald-400 font-mono text-xs font-bold tracking-wider mb-1 uppercase">{phase.duration}</p>
                              <h4 className="text-xl font-bold text-slate-100 mb-2">{phase.phaseName}</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">{phase.action}</p>
                           </div>
                            <div className="flex items-center gap-2 mt-4">
                               <div className="bg-[#050a0f] px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2 w-fit">
                                  <Droplets className="w-4 h-4 text-sky-400" />
                                  <span className="text-xs text-slate-400">Water Need:</span>
                                  <span className="text-xs font-bold text-slate-200">{phase.waterNeed}</span>
                               </div>
                            </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         <div className="space-y-6">
            <div className="bg-[#0a111a] p-6 rounded-3xl border border-white/5">
               <h3 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2 mb-6">
                  <Coins className="w-5 h-5 text-emerald-500" /> Cost Breakdown
               </h3>
               {isLoading ? (
                  <div className="space-y-3">
                     <div className="h-8 w-full bg-white/5 animate-pulse rounded"></div>
                     <div className="h-8 w-full bg-white/5 animate-pulse rounded"></div>
                  </div>
               ) : (
                  <div className="space-y-3">
                     {guide?.costBreakdown?.map((cost: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-[#050a0f] p-3 rounded-xl border border-white/5">
                           <span className="text-sm text-slate-300">{cost.item}</span>
                           <span className="text-sm font-bold text-emerald-400">{cost.cost}</span>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            <div className="bg-[#0a111a] p-6 rounded-3xl border border-white/5">
               <h3 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2 mb-6">
                  <ShieldAlert className="w-5 h-5 text-rose-500" /> Pest & Disease Watch
               </h3>
               {isLoading ? (
                  <div className="space-y-3">
                     <div className="h-8 w-full bg-white/5 animate-pulse rounded"></div>
                  </div>
               ) : (
                  <ul className="space-y-3">
                     {guide?.commonDiseases?.map((d: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                           <ShieldAlert className="w-4 h-4 text-rose-500/70 shrink-0 mt-0.5" /> {d}
                        </li>
                     ))}
                  </ul>
               )}
            </div>

            <div className="bg-[#0a111a] p-6 rounded-3xl border border-white/5">
               <h3 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2 mb-6">
                  <FlaskConical className="w-5 h-5 text-emerald-500" /> Recommended Chemicals
               </h3>
               {isLoading ? (
                  <div className="space-y-3">
                     <div className="h-12 w-full bg-white/5 animate-pulse rounded"></div>
                     <div className="h-12 w-full bg-white/5 animate-pulse rounded"></div>
                  </div>
               ) : (
                  <div className="space-y-3">
                     {guide?.recommendedChemicals?.map((chem: any, i: number) => (
                        <div key={i} className="bg-[#050a0f] p-4 rounded-xl border border-white/5">
                           <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-bold text-slate-200">{chem.name}</span>
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">{chem.type}</span>
                           </div>
                           <p className="text-xs text-slate-400 leading-relaxed">{chem.purpose}</p>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
