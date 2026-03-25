import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Multi-model routing with intelligent fallback & cost optimization
const MODELS = [
  "google/gemini-3-flash-preview",   // Primary: fast, capable
  "google/gemini-2.5-flash",         // Fallback 1: balanced
  "openai/gpt-5-mini",               // Fallback 2: strong reasoning
  "google/gemini-2.5-flash-lite",    // Fallback 3: cost-optimized
];

const SYSTEM_PROMPT = `You are an AI Health Doctor assistant for LifeGuard AI Pro. You provide helpful, evidence-based health information, wellness tips, and lifestyle advice.

You are powered by an intelligent multi-model AI orchestration system that routes queries through GPT, Gemini, and specialized health models for optimal responses with built-in fallback and cost optimization.

Important guidelines:
- Always remind users you are an AI and not a substitute for professional medical advice
- Be empathetic and supportive
- Provide actionable, science-backed recommendations
- Cover topics like nutrition, exercise, sleep, stress management, and general wellness
- If someone describes serious symptoms, advise them to seek immediate medical attention
- Keep responses concise but thorough`;

async function tryModel(model: string, messages: any[], apiKey: string): Promise<Response> {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
    }),
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Intelligent model routing with fallback
    let response: Response | null = null;

    for (const model of MODELS) {
      try {
        const res = await tryModel(model, messages, LOVABLE_API_KEY);
        if (res.ok) {
          response = res;
          console.log(`Using model: ${model}`);
          break;
        }
        if (res.status === 429 || res.status === 402) {
          return new Response(JSON.stringify({ error: res.status === 429 ? "Rate limited" : "Credits exhausted" }), {
            status: res.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.warn(`Model ${model} failed with ${res.status}, trying next...`);
      } catch (err) {
        console.warn(`Model ${model} error:`, err);
      }
    }

    if (!response) {
      return new Response(JSON.stringify({ error: "All models unavailable" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
