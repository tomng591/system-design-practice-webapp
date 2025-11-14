import { generateText } from 'ai';
import { getModel } from './llm';
import { LLMError } from './llm-error';
import type { Provider, Model } from './llm';

export interface LLMResponse {
  content: string;
  provider: Provider;
  model: Model;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

function validateInput(message: string): void {
  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a non-empty string');
  }
  if (message.trim().length === 0) {
    throw new Error('Message cannot be empty or whitespace only');
  }
}

export async function callLLM(
  provider: Provider,
  model: Model,
  message: string,
  systemPrompt?: string
): Promise<LLMResponse> {
  try {
    // Validate input
    validateInput(message);

    // Get the model instance for this provider
    const selectedModel = getModel(provider, model);

    if (!selectedModel) {
      throw new Error(`Model not found: ${provider}/${model}`);
    }

    // Call the LLM
    const result = await generateText({
      model: selectedModel,
      system: systemPrompt,
      prompt: message,
    });

    return {
      content: result.text,
      provider,
      model,
      usage: result.usage,
    };
  } catch (error) {
    throw new LLMError(
      provider,
      error instanceof Error ? error : new Error(String(error)),
      `Failed to call ${provider}/${model}`
    );
  }
}
