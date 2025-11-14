export class LLMError extends Error {
  constructor(
    public provider: string,
    public originalError: Error,
    message?: string
  ) {
    super(message || originalError.message);
    this.name = 'LLMError';
  }
}

export function isLLMError(error: unknown): error is LLMError {
  return error instanceof LLMError;
}
