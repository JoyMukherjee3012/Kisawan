import { config } from 'dotenv';
config({ path: '.env' });
const key = process.env.VITE_GEMINI_API_KEY;

fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key)
  .then(r => r.json())
  .then(data => {
     console.log(data.models.map(m => m.name));
  })
  .catch(console.error);
