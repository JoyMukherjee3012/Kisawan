export const getEnv = () => {
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!WEATHER_API_KEY) {
    throw new Error("CRITICAL: VITE_WEATHER_API_KEY is missing from environment variables.");
  }
  
  if (!GEMINI_API_KEY) {
    throw new Error("CRITICAL: VITE_GEMINI_API_KEY is missing from environment variables.");
  }

  return {
    WEATHER_API_KEY,
    GEMINI_API_KEY
  };
};
