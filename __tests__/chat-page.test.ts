describe('Chat Page (useChat)', () => {
  it('should export default component', () => {
    const page = require('../app/chat/page').default;
    expect(page).toBeDefined();
    expect(typeof page).toBe('function');
  });

  it('should import useChat from ai/react', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/chat/page.tsx', 'utf-8');
    expect(content).toContain('useChat');
    expect(content).toContain('ai/react');
  });

  it('should import chat components', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/chat/page.tsx', 'utf-8');
    expect(content).toContain('ChatContainer');
    expect(content).toContain('ChatInput');
  });

  it('should have provider and model configuration', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/chat/page.tsx', 'utf-8');
    expect(content).toContain('selectedProvider');
    expect(content).toContain('selectedModel');
  });

  it('should have api endpoint configured', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/chat/page.tsx', 'utf-8');
    expect(content).toContain('/api/chat');
  });

  it('should import from llm configuration', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/chat/page.tsx', 'utf-8');
    expect(content).toContain('@/lib/llm');
    expect(content).toContain('llmModels');
  });
});
