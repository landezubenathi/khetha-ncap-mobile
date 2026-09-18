import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MAX_ANSWER_VALUE = 3;
const MAX_CAREERS = 20;

interface CareerSummary { id: string; title: string; skills: string[]; subjects: string[]; field: string; }
interface RequestBody { type: string; answers: Record<string, number>; careers: CareerSummary[]; }

// ── JWT verification ──────────────────────────────────────────────────────────
async function verifyJWT(req: Request): Promise<{ userId: string } | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const supabaseUrl  = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!supabaseUrl || !serviceKey) return null;

  const client = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user) return null;
  return { userId: user.id };
}

// ── Input sanitisation ────────────────────────────────────────────────────────
function sanitise(body: RequestBody): { valid: boolean; reason?: string } {
  if (!['career', 'job-fit', 'subjects'].includes(body.type))
    return { valid: false, reason: 'Invalid quiz type' };

  if (!body.answers || typeof body.answers !== 'object')
    return { valid: false, reason: 'Missing answers' };

  for (const [key, val] of Object.entries(body.answers)) {
    if (typeof val !== 'number' || val < 0 || val > MAX_ANSWER_VALUE || !Number.isInteger(val))
      return { valid: false, reason: `Invalid answer value for key: ${key}` };
    if (!/^[a-z0-9_]+$/.test(key))
      return { valid: false, reason: `Invalid answer key: ${key}` };
  }

  if (!Array.isArray(body.careers) || body.careers.length === 0 || body.careers.length > MAX_CAREERS)
    return { valid: false, reason: 'Invalid careers array' };

  for (const c of body.careers) {
    if (!c.id || typeof c.id !== 'string' || !/^[a-z0-9-]+$/.test(c.id))
      return { valid: false, reason: `Invalid career id: ${c.id}` };
  }

  return { valid: true };
}

// ── CORS headers ──────────────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  // ── Auth check ──────────────────────────────────────────────────────────────
  const auth = await verifyJWT(req);
  if (!auth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  // ── OpenAI key check ────────────────────────────────────────────────────────
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'AI service not configured' }), {
      status: 503, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  // ── Parse + sanitise body ───────────────────────────────────────────────────
  let body: RequestBody;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: CORS }); }

  const check = sanitise(body);
  if (!check.valid) {
    return new Response(JSON.stringify({ error: check.reason }), {
      status: 422, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const { type, answers, careers } = body;

  // ── OpenAI request ──────────────────────────────────────────────────────────
  const systemPrompt = `You are a South African career guidance assistant for the NCAP Khetha platform.
Given a user's ${type} questionnaire answers (scale 0–3) and a list of careers, rank the top 5 careers by fit.
Return ONLY valid JSON in this exact shape, no markdown, no explanation:
{"careers":[{"id":"...","score":0-100,"reason":"...max 15 words..."}]}`;

  const userPrompt = `Careers: ${JSON.stringify(careers)}\nAnswers: ${JSON.stringify(answers)}`;

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 400,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return new Response(JSON.stringify({ error: 'AI service error', detail: err }), {
      status: 502, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const completion = await response.json();
  const content = completion.choices?.[0]?.message?.content;

  try {
    const parsed = JSON.parse(content);
    // Validate response shape before returning
    if (!Array.isArray(parsed?.careers)) throw new Error('bad shape');
    return new Response(JSON.stringify(parsed), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to parse AI response', raw: content }), {
      status: 502, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
