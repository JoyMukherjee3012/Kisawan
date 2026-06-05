import { config } from 'dotenv';
config({ path: '.env' });
const key = process.env.VITE_GEMINI_API_KEY;
if (!key) {
  console.log('NO KEY');
  process.exit(1);
}

const prompt = `You are an elite Agricultural AI.
NEVER USE THE ASTERISK SYMBOL. DO NOT USE MARKDOWN BOLDING.
Return EXACTLY a raw JSON object with NO formatting markers, NO backticks.

DATA PAYLOAD:
Location: New York, New York
Weather Details: 
- Temp: 32C (Feels Like 32C)
- Condition: Clear
- Humidity: 50% 
- Pressure: 1012 mb
- UV Index: 5
- Cloud Cover: 15%
- Visibility: 10 km
- Wind: 10 km/h N
- Rain Prob: 0%
Soil:
- Type: Loam
- pH: 6.8
- Org Carbon (SOC): 1.50%
- Nitrogen: 0.15 g/kg
- Clay: 30.0%, Sand: 40.0%, Silt: 30.0%
- Fertility: Medium
- Water Retention: Medium

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
Include exactly 3 topCrops, and exactly 8 additionalCrops.`;

const start = Date.now();
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
  })
})
  .then(r => {
     console.log('Status:', r.status);
     return r.json();
  })
  .then(data => {
    const elapsed = Date.now() - start;
    console.log(`Took ${elapsed}ms`);
    if (data.error) console.error(data.error);
    else console.log('Success, choices:', data.candidates?.length);
  })
  .catch(console.error);
