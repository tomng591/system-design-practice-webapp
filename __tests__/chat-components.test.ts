describe('Chat Components', () => {
  it('should export ChatMessage component', () => {
    const { ChatMessage } = require('../components/ChatMessage');
    expect(ChatMessage).toBeDefined();
    expect(typeof ChatMessage).toBe('function');
  });

  it('should export ChatInput component', () => {
    const { ChatInput } = require('../components/ChatInput');
    expect(ChatInput).toBeDefined();
    expect(typeof ChatInput).toBe('function');
  });

  it('should export ChatContainer component', () => {
    const { ChatContainer } = require('../components/ChatContainer');
    expect(ChatContainer).toBeDefined();
    expect(typeof ChatContainer).toBe('function');
  });

  it('should export Message type from ChatContainer', () => {
    // Type is exported but only available at compile time
    // This test verifies the module exports without error
    expect(() => require('../components/ChatContainer')).not.toThrow();
  });

  it('should export components from index file', () => {
    const exported = require('../components/index');
    expect(exported.ChatMessage).toBeDefined();
    expect(exported.ChatInput).toBeDefined();
    expect(exported.ChatContainer).toBeDefined();
  });
});
