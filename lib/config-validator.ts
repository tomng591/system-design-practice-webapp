export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.OPENAI_API_KEY) {
    errors.push('OPENAI_API_KEY not set');
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    errors.push('ANTHROPIC_API_KEY not set');
  }

  if (!process.env.GOOGLE_GENAI_API_KEY) {
    errors.push('GOOGLE_GENAI_API_KEY not set');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
