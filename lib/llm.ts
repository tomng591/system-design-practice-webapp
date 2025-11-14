import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

export const llmModels = {
  openai: {
    'gpt-4': openai('gpt-4'),
    'gpt-3.5-turbo': openai('gpt-3.5-turbo'),
  },
  anthropic: {
    'claude-3-opus': anthropic('claude-3-opus-20240229'),
    'claude-3-sonnet': anthropic('claude-3-sonnet-20240229'),
  },
  google: {
    'gemini-pro': google('gemini-pro'),
    'gemini-1.5-pro': google('gemini-1.5-pro'),
  },
};

export type Provider = keyof typeof llmModels;
export type Model = string;

export function getModel(provider: Provider, model: Model) {
  return llmModels[provider]?.[model as keyof typeof llmModels[Provider]];
}
