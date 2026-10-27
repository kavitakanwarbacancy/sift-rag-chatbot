## Packages used
1. express - server banane ke liye (routes/endpoints)
2. multer -	user se PDF file upload receive karne ke liye
3. pdf-parse -	PDF ke andar ka text nikalne ke liye
4. @huggingface/inference - free local embedding model — chunks ko vectors me convert karega 
5. vectra - local vector database — vectors store + similarity search karega
6. @google/genai - Gemini API call karne ke liye (final answer generate)
7. dotenv - .env file se secrets (API key) load karne ke liye
8. cors - frontend alag port pe chalega to backend ko call karne dega


Ask questions like-
1. How many days a week should a beginner train?
2. Should you eat before working out?
3. How do you tell normal muscle soreness apart from an injury?
4. Do you need cardio for fat loss, or is lifting weights enough?
5. Is creatine safe to take, and what does it actually do?

1. Why is Pluto not considered a planet anymore?
2. How do rockets actually work?
3. What is a black hole?
4. Do astronauts really age slower in space?
5. Is there really no gravity in space?

## Frontend (Next.js)
UI `app/` folder me hai — sirf 3 files:
- `app/page.js` — poora chat screen (ek hi component)
- `app/globals.css` — styling
- `app/layout.js` — html/body wrapper

Backend wahi purana `server.js` (Express) hai, usme kuch nahi badla.
Next sirf `/upload`, `/chat`, `/files` ko `next.config.js` ke rewrites se port 5001 pe
forward karta hai — isliye browser me ek hi origin dikhta hai aur CORS ki zarurat nahi.

Note: `.next/` folder Next ka build output hai — auto-generate hota hai, usme kuch
padhna/likhna nahi hota. Delete kar do to `npm run dev` firse bana dega.

## Chalane ke liye (do terminal)
```bash
npm run server   # Express + RAG  -> http://localhost:5001
npm run dev      # Next.js UI     -> http://localhost:3000
```
Browser me `http://localhost:3000` kholein.
