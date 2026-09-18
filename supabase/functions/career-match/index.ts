import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

interface CareerSummary { id: string; title: string; skills: string[]; subjects: string[]; field: string; }
interface RequestBody { type: string; answers: Record<string, number>; careers: CareerSummary[]; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } });
  }

  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), { status: 503 });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { type, answers, careers } = body;
  if (!answers || !careers?.length) {
    return new Response(JSON.stringify({ error: 'Missing answers or careers' }), { status: 400 });
  }

  const systemPrompt = `You are a South African career guidance assistant for the NCAP Khetha platform.
Given a user's ${type} questionnaire answers (scale 0–3) and a list of careers, rank the top 5 careers by fit.
Return ONLY valid JSON in this exact shape, no markdown, no explanation:
{"careers":[{"id":"...","score":0-100,"reason":"...max 15 words..."}]}`;

  const userPrompt = `Careers: ${JSON.stringify(careers)}
Answers: ${JSON.stringify(answers)}`;

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
    return new Response(JSON.stringify({ error: err }), { status: 502 });
  }

  const completion = await response.json();
  const content = completion.choices?.[0]?.message?.content;

  try {
    const parsed = JSON.parse(content);
    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to parse AI response', raw: content }), { status: 502 });
  }
});
