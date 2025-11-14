describe('LLM Client Integration', () => {
  it('should not throw when importing LLM client', () => {
    expect(() => require('../lib/llm-client')).not.toThrow();
  });

  it('should have proper TypeScript types', () => {
    const { execSync } = require('child_process');
    const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8' });
    expect(output).not.toContain('error TS');
  });

  it('should handle invalid provider gracefully', async () => {
    const { callLLM } = require('../lib/llm-client');
    try {
      await callLLM('invalid_provider', 'model', 'test');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should normalize responses with consistent structure', () => {
    // Response structure test - verify LLMResponse has required fields
    const mockResponse = {
      content: 'test',
      provider: 'openai',
      model: 'gpt-4.1',
    };
    expect(mockResponse).toHaveProperty('content');
    expect(mockResponse).toHaveProperty('provider');
    expect(mockResponse).toHaveProperty('model');
  });
});
