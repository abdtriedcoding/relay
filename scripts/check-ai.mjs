import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, 'packages', 'backend', '.env.local');

function loadKey() {
  if (process.env.COHERE_API_KEY) return process.env.COHERE_API_KEY;
  try {
    const text = readFileSync(envPath, 'utf8');
    const line = text.split(/\r?\n/).find((l) => l.startsWith('COHERE_API_KEY='));
    return line ? line.split('=').slice(1).join('=').trim() : null;
  } catch {
    return null;
  }
}

const key = loadKey();

if (!key || key === 'your_cohere_api_key') {
  console.error('Set COHERE_API_KEY in packages/backend/.env.local first.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json'
};

async function checkChat() {
  const response = await fetch('https://api.cohere.com/v2/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'command-a-03-2025',
      messages: [{ role: 'user', content: [{ type: 'text', text: 'Reply with the word OK.' }] }]
    })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`chat failed: ${JSON.stringify(body)}`);
  console.log('chat:', body.text || body.message?.content?.[0]?.text);
}

async function checkEmbedding() {
  const response = await fetch('https://api.cohere.com/v2/embed', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'embed-v4.0',
      texts: ['demo check'],
      input_type: 'search_document'
    })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`embedding failed: ${JSON.stringify(body)}`);
  const vector = body.embeddings?.float?.[0] || body.embeddings?.[0];
  console.log('embedding dimensions:', vector?.length);
}

try {
  await checkChat();
  await checkEmbedding();
  console.log('Cohere trial key works. Relay can use it for chat and RAG.');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
