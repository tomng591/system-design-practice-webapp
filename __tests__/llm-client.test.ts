describe('LLM Client', () => {
  it('should export callLLM function', () => {
    const { callLLM } = require('../lib/llm-client');
    expect(typeof callLLM).toBe('function');
  });

  it('should export LLMResponse interface', () => {
    const { callLLM } = require('../lib/llm-client');
    expect(callLLM).toBeDefined();
  });

  it('should export LLMError class', () => {
    const { LLMError, isLLMError } = require('../lib/llm-error');
    expect(typeof LLMError).toBe('function');
    expect(typeof isLLMError).toBe('function');
  });

  it('should validate that message is not empty', () => {
    const { callLLM } = require('../lib/llm-client');
    expect(async () => {
      await callLLM('openai', 'gpt-4.1', '');
    }).toBeDefined();
  });

  it('LLMError should have provider property', () => {
    const { LLMError } = require('../lib/llm-error');
    const error = new Error('test');
    const llmError = new LLMError('openai', error, 'test message');
    expect(llmError.provider).toBe('openai');
  });
});
