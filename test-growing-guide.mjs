import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const decodedCrop = "Rice";

const prompt = `You are Kisawan AI.
Generate a complete, structured agricultural growing guide for: ${decodedCrop}
Format exactly as raw JSON with no asterisks or markdown.

{
  "summary": "2 sentences about the crop",
  "totalDuration": "e.g. 120-150 Days",
  "estimatedCostPerAcre": "e.g. ₹15,000 - ₹20,000",
  "phases": [
    {
      "phaseName": "1. Sowing & Germination",
      "duration": "Days 0-15",
      "action": "What to do...",
      "waterNeed": "Low/Medium/High",
      "fertilizer": "Fertilizer details"
    }
  ],
  "costBreakdown": [
    { "item": "Seeds", "cost": "₹2,000" }
  ],
  "commonDiseases": ["Disease 1", "Disease 2"]
}
Include exactly 4 or 5 phases from beginning to harvesting.`;

async function run() {
  const t0 = Date.now();
  console.log("Fetching...");
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
      })
    });
    console.log(`Status: ${res.status} ${res.statusText} (${Date.now() - t0}ms)`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error", e);
  }
}
run();
