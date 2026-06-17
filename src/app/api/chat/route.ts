import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { ME_MD } from "@/lib/meData";

export const runtime = "edge";

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Read the me.md file to use as the system prompt
function getSystemPrompt() {
  return ME_MD;
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "API Key not configured." }, { status: 500 });
  }

  try {
    const { message, history } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Construct the chat context
    const profileContext = getSystemPrompt();
    const systemPrompt = `You are the AI terminal agent for Jayraj Patel's portfolio website. 
Your job is to answer questions about Jayraj based solely on the following context.
Keep your answers brief, somewhat witty, and format them clearly as if coming from a retro terminal. Do not use markdown styling like **bold**, use plain text or hyphens for lists.

Context about Jayraj:
${profileContext}

Current conversational history:
${history.map((h: any) => `${h.role}: ${h.text}`).join('\n')}

User question: ${message}`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate response." }, { status: 500 });
  }
}
