import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize Gemini SDK safely. It expects process.env.GEMINI_API_KEY
// We only initialize it inside the handler so it doesn't crash on startup if missing.
let ai: GoogleGenAI | null = null;

const WEATHER_API_KEY = "zpka_3814234363494428a8910f6faa93c430_71729712";

// Input Schema
const InputSchema = z.object({
  cropName: z.string(),
  lat: z.number().nullable().optional(),
  lon: z.number().nullable().optional(),
  locationText: z.string().optional()
});

export const getCropCareAdvice = createServerFn({ method: 'POST' })
  .validator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const { cropName, lat, lon, locationText } = data;

    if (!process.env.VITE_GEMINI_API_KEY) {
      throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to your .env file or environment variables.");
    }
    if (!ai) {
      ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
    }

    if (lat === undefined && lon === undefined && !locationText) {
      throw new Error("Must provide either precise coordinates (lat, lon) or a manual locationText.");
    }

    let query = "";
    if (lat !== undefined && lon !== undefined && lat !== null && lon !== null) {
      query = `${lat},${lon}`;
    } else if (locationText) {
      query = locationText;
    }

    // Call WeatherAPI
    const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`;
    const weatherRes = await fetch(weatherUrl);
    
    if (!weatherRes.ok) {
      throw new Error(`Failed to fetch weather data for location: ${query}`);
    }
    
    const weatherData = await weatherRes.json();
    
    if (weatherData.error) {
      throw new Error(`Weather API Error: ${weatherData.error.message}`);
    }

    const loc = weatherData.location;
    const current = weatherData.current;

    const fullyConstructedPlaceName = `${loc.name}, ${loc.region ? loc.region + ', ' : ''}${loc.country}`;
    const weatherText = current.condition.text;
    const temp = current.temp_c;
    const humidity = current.humidity;
    const precipitation = current.precip_mm;
    const windSpeed = current.wind_kph;

    const prompt = `Act as an expert agronomist. Provide crop care suggestions for growing the crop '${cropName}' in '${fullyConstructedPlaceName}'. 
The true, localized weather readings right now are:
- Weather Status: ${weatherText}
- Temperature: ${temp}°C
- Relative Humidity: ${humidity}%
- Precipitation (Past Hour): ${precipitation}mm
- Wind Speed: ${windSpeed}km/h
Analyze these exact environmental conditions and provide specific, actionable crop management advice.`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        crop: { type: Type.STRING },
        verifiedLocationName: { type: Type.STRING },
        coordinatesUsed: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER, nullable: true },
            lon: { type: Type.NUMBER, nullable: true }
          }
        },
        weatherReadings: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            tempC: { type: Type.NUMBER },
            humidity: { type: Type.NUMBER },
            precipitationMm: { type: Type.NUMBER },
            windSpeedKmh: { type: Type.NUMBER }
          },
          required: ["status", "tempC", "humidity", "precipitationMm", "windSpeedKmh"]
        },
        agronomyCareAdvice: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              advice: { type: Type.STRING },
              urgency: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            },
            required: ["category", "advice", "urgency"]
          }
        },
        criticalAlert: { type: Type.STRING, nullable: true }
      },
      required: ["crop", "verifiedLocationName", "coordinatesUsed", "weatherReadings", "agronomyCareAdvice"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Act as an expert agronomist.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const parsedText = response.text;
    if (!parsedText) {
      throw new Error("Failed to generate response from Gemini API.");
    }
    
    let resultObj = JSON.parse(parsedText);
    
    // Inject the known fields to guarantee correctness
    resultObj.verifiedLocationName = fullyConstructedPlaceName;
    resultObj.coordinatesUsed = { lat: lat || null, lon: lon || null };
    
    return resultObj;
  });
