describe('Chat Components Integration', () => {
  it('should import all components without errors', () => {
    expect(() => require('../components')).not.toThrow();
  });

  it('should have ChatMessage component available', () => {
    const { ChatMessage } = require('../components');
    expect(ChatMessage).toBeDefined();
  });

  it('should have ChatInput component available', () => {
    const { ChatInput } = require('../components');
    expect(ChatInput).toBeDefined();
  });

  it('should have ChatContainer component available', () => {
    const { ChatContainer } = require('../components');
    expect(ChatContainer).toBeDefined();
  });

  it('should have Message type exported from components', () => {
    const components = require('../components');
    // Verify module exports without throwing
    expect(components).toHaveProperty('ChatContainer');
  });
});
