export const availableModels = {
  openai: ['gpt-4', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-opus', 'claude-3-sonnet'],
  google: ['gemini-pro', 'gemini-1.5-pro'],
};

export const providers = Object.keys(availableModels) as Array<keyof typeof availableModels>;
