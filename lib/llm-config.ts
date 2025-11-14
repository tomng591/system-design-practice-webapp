export const availableModels = {
  openai: ['gpt-4.1', 'gpt-4.1-mini', 'gpt-4o'],
  anthropic: ['claude-sonnet-4.5', 'claude-haiku-4.5', 'claude-opus-4.1'],
  google: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'],
};

export const providers = Object.keys(availableModels) as Array<keyof typeof availableModels>;
