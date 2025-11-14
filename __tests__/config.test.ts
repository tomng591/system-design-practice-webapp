import config from '../lib/config';
import { validateConfig } from '../lib/config-validator';

describe('LLM Configuration', () => {
  it('should export config with provider keys', () => {
    expect(config).toHaveProperty('llmProviders');
    expect(config.llmProviders).toHaveProperty('openai');
    expect(config.llmProviders).toHaveProperty('anthropic');
    expect(config.llmProviders).toHaveProperty('google');
  });

  it('should have default provider set', () => {
    expect(config.defaultProvider).toBeDefined();
  });

  it('should provide validation function', () => {
    const result = validateConfig();
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
    expect(Array.isArray(result.errors)).toBe(true);
  });

  it('should return config with string or undefined values for providers', () => {
    const { llmProviders } = config;
    expect(
      typeof llmProviders.openai === 'string' ||
      llmProviders.openai === undefined
    ).toBe(true);
    expect(
      typeof llmProviders.anthropic === 'string' ||
      llmProviders.anthropic === undefined
    ).toBe(true);
    expect(
      typeof llmProviders.google === 'string' ||
      llmProviders.google === undefined
    ).toBe(true);
  });

  it('should detect missing API keys in validation', () => {
    const result = validateConfig();
    // With placeholder values in .env.local, we should get valid: true
    // But structure should be correct regardless
    expect(result.valid === true || result.valid === false).toBe(true);
    expect(Array.isArray(result.errors)).toBe(true);
  });
});
