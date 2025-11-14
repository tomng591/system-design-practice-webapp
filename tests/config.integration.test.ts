import fs from 'fs';
import path from 'path';

describe('Configuration Integration', () => {
  it('should load config module without errors', () => {
    const config = require('../lib/config').default;
    expect(config).toBeDefined();
  });

  it('should run validation without errors', () => {
    const { validateConfig } = require('../lib/config-validator');
    expect(() => validateConfig()).not.toThrow();
  });

  it('should not expose API keys to client side by accident', () => {
    const configPath = path.join(__dirname, '../lib/config.ts');
    const content = fs.readFileSync(configPath, 'utf-8');
    // Verify we're using process.env correctly
    expect(content).toContain('process.env');
    // Verify we're not exporting API keys directly in public way
    expect(content).not.toContain('export const OPENAI_API_KEY');
  });

  it('should have .env.local in gitignore', () => {
    const gitignorePath = path.join(__dirname, '../.gitignore');
    const content = fs.readFileSync(gitignorePath, 'utf-8');
    expect(content).toContain('.env.local');
  });

  it('should have .env.example file without secrets', () => {
    const envExamplePath = path.join(__dirname, '../.env.example');
    const content = fs.readFileSync(envExamplePath, 'utf-8');
    // Should have env var names
    expect(content).toContain('NEXT_PUBLIC_LLM_PROVIDER');
    expect(content).toContain('OPENAI_API_KEY');
    // Should NOT have actual secrets
    expect(content).not.toContain('sk-');
    expect(content).not.toContain('placeholder');
  });

  it('should have config validator that returns proper structure', () => {
    const { validateConfig } = require('../lib/config-validator');
    const result = validateConfig();

    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
    expect(typeof result.valid).toBe('boolean');
    expect(Array.isArray(result.errors)).toBe(true);

    // All errors should be strings
    result.errors.forEach((error: any) => {
      expect(typeof error).toBe('string');
    });
  });
});
