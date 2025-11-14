describe('Chat Page Integration (useChat)', () => {
  it('should have chat page route defined', () => {
    const fs = require('fs');
    expect(fs.existsSync('./app/chat/page.tsx')).toBe(true);
  });

  it('should import useChat hook without errors', () => {
    expect(() => {
      require('ai/react');
    }).not.toThrow();
  });

  it('should import llm configuration without errors', () => {
    expect(() => {
      require('../lib/llm');
    }).not.toThrow();
  });

  it('should import all chat components without errors', () => {
    expect(() => {
      require('../components');
    }).not.toThrow();
  });

  it('should have chat components available from barrel export', () => {
    const { ChatContainer, ChatInput } = require('../components');
    expect(ChatContainer).toBeDefined();
    expect(ChatInput).toBeDefined();
  });

  it('should have ui card component available', () => {
    expect(() => {
      require('../components/ui/card');
    }).not.toThrow();
  });
});
