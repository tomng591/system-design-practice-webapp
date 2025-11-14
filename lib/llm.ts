import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

export const llmModels = {
  openai: {
    'gpt-4.1': openai('gpt-4.1-2025-04-14'),
    'gpt-4.1-mini': openai('gpt-4.1-mini-2025-04-14'),
    'gpt-4o': openai('gpt-4o-2024-11-20'),
  },
  anthropic: {
    'claude-sonnet-4.5': anthropic('claude-sonnet-4-5-20250929'),
    'claude-haiku-4.5': anthropic('claude-haiku-4-5-20251001'),
    'claude-opus-4.1': anthropic('claude-opus-4-1-20250805'),
  },
  google: {
    'gemini-2.5-pro': google('gemini-2.5-pro'),
    'gemini-2.5-flash': google('gemini-2.5-flash'),
    'gemini-2.5-flash-lite': google('gemini-2.5-flash-lite'),
  },
};

export type Provider = keyof typeof llmModels;
export type Model = string;

export function getModel(provider: Provider, model: Model) {
  return llmModels[provider]?.[model as keyof typeof llmModels[Provider]];
}
