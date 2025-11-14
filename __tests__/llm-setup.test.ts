import { llmModels, getModel } from '../lib/llm';
import { availableModels, providers } from '../lib/llm-config';

describe('ai-sdk Setup', () => {
  it('should have ai-sdk installed', () => {
    const pkg = require('../package.json');
    expect(pkg.dependencies).toHaveProperty('ai');
  });

  it('should have all provider packages installed', () => {
    const pkg = require('../package.json');
    expect(pkg.dependencies).toHaveProperty('@ai-sdk/openai');
    expect(pkg.dependencies).toHaveProperty('@ai-sdk/anthropic');
    expect(pkg.dependencies).toHaveProperty('@ai-sdk/google');
  });

  it('should export llmModels with all providers', () => {
    expect(llmModels).toHaveProperty('openai');
    expect(llmModels).toHaveProperty('anthropic');
    expect(llmModels).toHaveProperty('google');
  });

  it('should have available models defined', () => {
    expect(availableModels.openai.length).toBeGreaterThan(0);
    expect(availableModels.anthropic.length).toBeGreaterThan(0);
    expect(availableModels.google.length).toBeGreaterThan(0);
  });

  it('should export getModel function', () => {
    expect(typeof getModel).toBe('function');
  });

  it('should have providers array exported', () => {
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBe(3);
  });

  it('should have models for each provider in llmModels', () => {
    expect(Object.keys(llmModels.openai).length).toBeGreaterThan(0);
    expect(Object.keys(llmModels.anthropic).length).toBeGreaterThan(0);
    expect(Object.keys(llmModels.google).length).toBeGreaterThan(0);
  });
});
