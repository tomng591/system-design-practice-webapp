const config = {
  llmProviders: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    google: process.env.GOOGLE_GENAI_API_KEY,
  },
  defaultProvider: process.env.NEXT_PUBLIC_LLM_PROVIDER || 'openai',
};

export default config;
