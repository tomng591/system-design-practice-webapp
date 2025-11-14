import { getModel } from '../lib/llm';

describe('ai-sdk Integration', () => {
  it('should not have TypeScript errors', () => {
    const { execSync } = require('child_process');
    const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8' });
    expect(output).not.toContain('error TS');
  });

  it('getModel should return model object for valid provider/model', () => {
    const model = getModel('openai', 'gpt-4');
    expect(model).toBeDefined();
    expect(model).not.toBeNull();
  });

  it('getModel should return undefined for invalid provider', () => {
    const model = getModel('invalid' as any, 'model');
    expect(model).toBeUndefined();
  });

  it('getModel should return undefined for invalid model in valid provider', () => {
    const model = getModel('openai', 'invalid-model');
    expect(model).toBeUndefined();
  });

  it('should have gpt-4 model available from OpenAI', () => {
    const model = getModel('openai', 'gpt-4');
    expect(model).toBeDefined();
  });

  it('should have claude-3-opus model available from Anthropic', () => {
    const model = getModel('anthropic', 'claude-3-opus');
    expect(model).toBeDefined();
  });

  it('should have gemini-pro model available from Google', () => {
    const model = getModel('google', 'gemini-pro');
    expect(model).toBeDefined();
  });
});
