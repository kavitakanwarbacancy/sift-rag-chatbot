const express = require("express");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
// embeddings
const { InferenceClient } = require("@huggingface/inference");
// create client and pass our token
const hf = new InferenceClient(process.env.HF_TOKEN);
// retreival through vectra
const { LocalIndex } = require("vectra");
const path = require("path");
// Gemini API
const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
app.use(cors());
// to parse json body
app.use(express.json());

// will give us storage path to sotre index (vectors)
const index = new LocalIndex(path.join(__dirname, "data"));

// PDF parsing
async function extractText(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

// Chunking
function chunkText(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }
  return chunks;
}

// generate embeddings
async function embedText(text, isQuery = false) {
    const input = isQuery
    ? `Represent this sentence for searching relevant passages: ${text}`
    : text;

  const result = await hf.featureExtraction({
    model: "BAAI/bge-small-en-v1.5",
    inputs: input,
    provider: "hf-inference",
  });
  return result;
}

// Store vector
async function ensureIndex() {
  if (!(await index.isIndexCreated())) {
    await index.createIndex();
  }
}

// decide where uploaded file will get stored and by which name
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
// creating middle which will handle files
const upload = multer({ storage });

// route - middle will save file in uploads and after that will be processed here
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const text = await extractText(req.file.path);
    const chunks = chunkText(text);
    await ensureIndex();
    for (const chunk of chunks) {
      const vector = await embedText(chunk);
      await index.insertItem({
        vector,
        metadata: { text: chunk },
      });
    }

    res.json({
      message: "Uploaded, Chunked, Embedded & Stored",
      totalChunks: chunks.length,
    });
  } catch (err) {
    console.error("UPLOAD FAILED:", err);
    res.status(500).json({ error: err.message });
  }
});

// try models in order - if one is busy (503) or rate limited (429), move to next
const MODELS = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"];
async function generateWithFallback(contents) {
  let lastErr;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await genAI.models.generateContent({ model, contents });
      } catch (err) {
        lastErr = err;
        console.warn(`${model} failed (${err.status}), retrying...`);
        if (![429, 500, 503, 504].includes(err.status)) break;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  throw lastErr;
}

app.post("/chat", async (req, res) => {
  const { question, history = [] } = req.body;

  //   Retrieval Logic
  await ensureIndex();
  const questionVector = await embedText(question, true);
  //   extract top 4 chunks from vectra
  const results = await index.queryItems(questionVector, "", 6);

  //   join chunks in 1 line
  const context = results.map((r) => r.item.metadata.text).join("\n\n");

  const contents = [
    ...history.map(m => ({
      role: m.role === 'me' ? 'user' : 'model',
      parts: [{text: m.text}]
    })),
    {
      role: 'user', parts: [{ text: `Answer the question using the context below as your primary source. You may add general knowledge to fill gaps only if conext is not available, and if context is half then fill the gaps based on fetched context only which is required.\n\nContext:\n${context}\n\nQuestion: ${question}` }]
    }
  ]

  const response = await generateWithFallback(contents);

  //   const relevantChunks = results.map(r => r.item.metadata.text);
  res.json({
    question,
    answer: response.text,
    sources: results.map((r) => r.item.metadata.text),
  });
});

app.get("/files", (req, res) => {
  const files = fs.readdirSync("uploads/");
  res.json({ files });
});

// listen to port 5001
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port", process.env.PORT || 5000);
});
