import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { auth } from '@/auth';

export const maxDuration = 30; // 30 seconds

export async function POST(req: Request) {
  try {
    // Basic auth check
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { prompt, systemPrompt } = await req.json();
    console.log("AI Request:", { prompt, systemPrompt });

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
    });

    console.log("Starting generateText...");
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt || 'You are an expert copywriter helping a professional build their portfolio. Write in Indonesian, keep it professional, impactful, and concise. Do not use AI clichés.',
      prompt: prompt,
    });
    
    console.log("Text generated successfully");
    return Response.json({ text: result.text });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
