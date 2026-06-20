import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { ME_MD } from "@/lib/meData";

export const runtime = "edge";

// Read the me.md file to use as the system prompt
function getSystemPrompt() {
  return ME_MD;
}

export async function POST(req: Request) {
  const apiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3
  ].filter(Boolean) as string[];

  if (apiKeys.length === 0) {
    return NextResponse.json({ error: "API Key not configured." }, { status: 500 });
  }

  let message = "";
  let history: any[] = [];

  try {
    const body = await req.json();
    message = body.message || "";
    history = body.history || [];
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const profileContext = getSystemPrompt();
  const systemPrompt = `You are the AI terminal agent for Jayraj Patel's portfolio website. 
Your job is to answer questions about Jayraj based solely on the following context.
Keep your answers brief, somewhat witty, and format them clearly as if coming from a retro terminal. Do not use markdown styling like **bold**, use plain text or hyphens for lists.

Context about Jayraj:
${profileContext}

Current conversational history:
${history.map((h: any) => `${h.role}: ${h.text}`).join('\n')}

User question: ${message}`;

  let successText = "";
  let lastError: any = null;

  for (let i = 0; i < apiKeys.length; i++) {
    try {
      const currentKey = apiKeys[i];
      const genAI = new GoogleGenerativeAI(currentKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const result = await model.generateContent(systemPrompt);
      successText = result.response.text();
      break; // Successfully got response, stop attempting next keys
    } catch (error: any) {
      console.warn(`[Key Rotation] Gemini Key ${i + 1} failed (Quota/Forbidden). Trying fallback...`);
      lastError = error;
    }
  }

  if (successText) {
    return NextResponse.json({ reply: successText });
  }

  // Try OpenRouter as a fallback if Gemini keys fail
  if (process.env.OPENROUTER_API_KEY) {
    const openRouterModels = [
      "nvidia/nemotron-3-ultra-550b-a55b:free",
      "google/gemini-2.5-flash:free",
      "meta-llama/llama-3.2-3b-instruct:free"
    ];

    for (const modelId of openRouterModels) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://jayraj.site",
            "X-Title": "Jayraj Portfolio",
          },
          body: JSON.stringify({
            model: modelId,
            messages: [
              {
                role: "user",
                content: systemPrompt
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          successText = data.choices?.[0]?.message?.content || "";
          if (successText) {
            console.log(`Successfully generated response using OpenRouter model: ${modelId}`);
            break;
          }
        } else {
          const errorText = await response.text();
          console.warn(`[Key Rotation] OpenRouter Model ${modelId} failed:`, errorText);
          lastError = new Error(`OpenRouter ${modelId} failed: ${errorText}`);
        }
      } catch (err: any) {
        console.warn(`[Key Rotation] OpenRouter Model ${modelId} fetch error:`, err.message || err);
        lastError = err;
      }
    }
  }

  if (successText) {
    return NextResponse.json({ reply: successText });
  }

  // If all keys fail, use the localized fallback
  const userMsg = (message || "").toLowerCase();
  let fallbackReply = "SYSTEM WARNING: Gemini API daily quota (free tier) exceeded.\n" +
                       "AI agent is currently running on localized basic subroutines.\n\n";

  if (userMsg.includes("project") || userMsg.includes("work")) {
    fallbackReply += "JAYRAJ'S PROJECTS:\n" +
                     "1. ICE MAKE NETRA VMS - Federated Video Management System (.NET 10, C#, WPF, React, Direct3D11, FFmpeg).\n" +
                     "2. Yatna.fit - Science-based fitness ecosystem and data-dense body composition matrix (React 19, Node.js, MongoDB, Tailwind CSS, CI/CD, React Native mobile apps).\n" +
                     "3. SSYV BhaktiSetu - Devotee management & networking platform (Next.js 15, React 19, Docker, Tailwind 4, TypeScript).";
  } else if (userMsg.includes("experience") || userMsg.includes("job") || userMsg.includes("role") || userMsg.includes("volunteer")) {
    fallbackReply += "JAYRAJ'S EXPERIENCE:\n" +
                     "- Lead Frontend & UI/UX Engineer (Volunteering, SSYV BhaktiSetu | JUN 2025 - PRESENT):\n" +
                     "  Led frontend architecture, built Next.js 15 onboarding pipelines, designed Tailwind 4 data-dense dashboards.\n" +
                     "- Software Developer / Engineer internships details are stored in the resume.";
  } else if (userMsg.includes("skill") || userMsg.includes("tech") || userMsg.includes("languages")) {
    fallbackReply += "JAYRAJ'S TECH STACK:\n" +
                     "- Frontend: React 19, Next.js 15, TypeScript, Tailwind CSS 4, HTML5/CSS3, JavaScript.\n" +
                     "- Backend & DB: Node.js, Express, MongoDB, .NET 10, C#.\n" +
                     "- Platforms: Docker, Git, FFmpeg, Direct3D11 GPU rendering.";
  } else if (userMsg.includes("contact") || userMsg.includes("email") || userMsg.includes("social")) {
    fallbackReply += "JAYRAJ'S CONTACT INFO:\n" +
                     "- Email & social links are available in the sidebar/footer menu.";
  } else {
    fallbackReply += "JAYRAJ'S PROFILE BRIEF:\n" +
                     "Jayraj Patel is a Software Engineer specializing in high-performance frontend architecture, UI/UX engineering, and full-stack development.\n\n" +
                     "Type 'projects', 'experience', or 'skills' for targeted details from local storage.";
  }

  fallbackReply += `\n\n[System status: API Keys exhausted. Last Error: ${lastError?.message || lastError || "Unknown Error"}]`;

  return NextResponse.json({ reply: fallbackReply });
}

