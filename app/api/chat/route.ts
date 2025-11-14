import { streamText } from 'ai';
import { getModel } from '@/lib/llm';
import type { Provider, Model } from '@/lib/llm';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Extract provider and model from request headers
    // (set by useChat hook in Task 1.7)
    const provider = (request.headers.get('x-provider') || 'openai') as Provider;
    const model = (request.headers.get('x-model') || 'gpt-4.1') as Model;

    // Get the model instance
    const selectedModel = getModel(provider, model);
    if (!selectedModel) {
      return new Response(
        JSON.stringify({
          error: `Model not found: ${provider}/${model}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert UIMessages from useChat to CoreMessages format for streamText
    // useChat sends messages with 'parts' array, but streamText needs 'content' string
    const coreMessages = messages.map((msg: any) => {
      let content = '';
      if (msg.parts && Array.isArray(msg.parts)) {
        content = msg.parts
          .map((part: any) => {
            if (part.type === 'text' && part.text) {
              return part.text;
            }
            return '';
          })
          .join('');
      }
      return {
        role: msg.role,
        content: content,
      };
    });

    // streamText handles ALL the complexity:
    // - Streaming responses token-by-token
    // - Backpressure handling
    // - Token usage tracking
    // - Error handling
    // - Response formatting for useChat
    const result = streamText({
      model: selectedModel,
      system: 'You are a helpful AI assistant specialized in system design coaching.',
      messages: coreMessages,
    });

    // Return the UI message stream response for useChat compatibility
    // This properly formats the stream with message metadata that useChat expects
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
