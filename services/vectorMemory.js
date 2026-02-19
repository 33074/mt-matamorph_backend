const pool = require('../config/db'); // MySQL pool
const OpenAI = require('openai');
const { cosineSimilarity } = require('./utils'); // helper for similarity

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Store embedding in MySQL
exports.embedText = async (table, resident_id, text) => {
  const embeddingResp = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  const vector = embeddingResp.data[0].embedding;

  await pool.execute(
    `INSERT INTO ${table} (resident_id, content, embedding) VALUES (?, ?, ?)`,
    [resident_id, text, JSON.stringify(vector)]
  );
};

// Query top-k similar embeddings
exports.queryVectorDB = async (table, queryText, topK = 3) => {
  // 1. Compute embedding for the query
  const embeddingResp = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: queryText
  });
  const queryVector = embeddingResp.data[0].embedding;

  // 2. Fetch all embeddings from MySQL
  const [rows] = await pool.execute(`SELECT id, content, embedding FROM ${table}`);
  
  // 3. Compute cosine similarity in Node.js
  const scored = rows.map(row => {
    const vec = JSON.parse(row.embedding);
    const score = cosineSimilarity(queryVector, vec);
    return { content: row.content, score };
  });

  // 4. Sort by similarity descending and take topK
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(r => r.content);
};
