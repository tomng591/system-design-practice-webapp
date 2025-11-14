describe('Chat API', () => {
  it('should have API route file', () => {
    const fs = require('fs');
    expect(fs.existsSync('./app/api/chat/route.ts')).toBe(true);
  });

  it('should import streamText', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/api/chat/route.ts', 'utf-8');
    expect(content).toContain('streamText');
    expect(content).toContain("from 'ai'");
  });

  it('should export POST handler', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/api/chat/route.ts', 'utf-8');
    expect(content).toContain('export async function POST');
  });

  it('should extract provider and model from headers', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/api/chat/route.ts', 'utf-8');
    expect(content).toContain('x-provider');
    expect(content).toContain('x-model');
  });

  it('should use getModel from llm.ts', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/api/chat/route.ts', 'utf-8');
    expect(content).toContain('getModel');
    expect(content).toContain('@/lib/llm');
  });

  it('should handle errors with try/catch', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/api/chat/route.ts', 'utf-8');
    expect(content).toContain('try {');
    expect(content).toContain('catch (error)');
  });

  it('should return toTextStreamResponse', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/api/chat/route.ts', 'utf-8');
    expect(content).toContain('toTextStreamResponse()');
  });

  it('should set runtime to nodejs', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/api/chat/route.ts', 'utf-8');
    expect(content).toContain("runtime = 'nodejs'");
  });

  it('should have default provider fallback', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/api/chat/route.ts', 'utf-8');
    expect(content).toContain("'openai'");
  });

  it('should have default model fallback', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/api/chat/route.ts', 'utf-8');
    expect(content).toContain("'gpt-4.1'");
  });
});
