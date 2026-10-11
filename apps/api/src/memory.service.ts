const QDRANT_URL = 'http://localhost:6333';
const COLLECTION_NAME = 'gittig_codebase_memory';

// হালকা ওয়ান-লাইন ভেক্টরাইজার (কোডকে ৪-ডাইমেনশনাল গাণিতিক ভেক্টরে রূপান্তর করে)
export function codeToVector(text: string, size = 4): number[] {
  const vec = new Array(size).fill(0);
  for (let i = 0; i < text.length; i++) {
    vec[i % size] += text.charCodeAt(i);
  }
  const mag = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map(v => Number((v / mag).toFixed(4)));
}

// Qdrant কালেকশন প্রস্তুত করা
export async function initQdrantCollection() {
  try {
    await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vectors: { size: 4, distance: 'Cosine' }
      })
    });
  } catch (err) {
    console.log('[Qdrant] Collection already exists or initialized.');
  }
}

// কোড সেভ করা (ইনডেক্সিং)
export async function saveCodeMemory(id: number, filePath: string, codeSnippet: string) {
  await initQdrantCollection();
  const vector = codeToVector(codeSnippet);

  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      points: [
        {
          id,
          vector,
          payload: { filePath, codeSnippet }
        }
      ]
    })
  });
  return await res.json();
}

// সেমান্টিক সার্চ (মেমোরি থেকে কোড খুঁজে বের করা)
export async function searchCodeMemory(query: string) {
  await initQdrantCollection();
  const vector = codeToVector(query);

  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vector,
      limit: 2,
      with_payload: true
    })
  });
  return await res.json();
}
