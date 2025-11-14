# Task 1.7: Create Chat Page with useChat Hook (AI SDK UI)

## Description
Build the main chat page using ai-sdk/ui's `useChat` hook for state management. This replaces ~100 lines of custom state management code with a single hook that automatically handles messages, loading states, errors, and streaming responses. The goal is to dramatically reduce implementation complexity while maintaining full functionality.

## Implementation Detail

### Steps:
1. Install ai-sdk/ui types if not already installed:
   ```bash
   npm install ai
   ```

2. Create `app/chat/page.tsx` - main chat page with useChat hook:
   ```typescript
   'use client';

   import { useState } from 'react';
   import { useChat } from 'ai/react';
   import { ChatContainer, ChatInput, ChatMessage } from '@/components/index';
   import { Card } from '@/components/ui/card';
   import { llmModels, type Provider, type Model } from '@/lib/llm';

   const providers = Object.keys(llmModels) as Provider[];

   export default function ChatPage() {
     const [selectedProvider, setSelectedProvider] = useState<Provider>('openai');
     const [selectedModel, setSelectedModel] = useState<Model>('gpt-4');

     // useChat hook handles ALL state management:
     // - messages array
     // - loading state
     // - error state
     // - streaming responses
     // - sending messages
     const { messages, input, setInput, append, isLoading, error } = useChat({
       api: '/api/chat',
       headers: {
         'x-provider': selectedProvider,
         'x-model': selectedModel,
       },
     });

     const handleSendMessage = async (message: string) => {
       setInput('');
       // useChat handles appending to messages, streaming, loading states
       await append({ role: 'user', content: message });
     };

     const currentProviderModels = llmModels[selectedProvider];
     const models = Object.keys(currentProviderModels) as Model[];

     return (
       <div className="flex flex-col h-screen bg-gray-50">
         {/* Header */}
         <div className="bg-white border-b p-4">
           <h1 className="text-2xl font-bold mb-4">LLM Chat (AI SDK Powered)</h1>

           {/* Provider and Model Selection */}
           <div className="flex gap-4">
             {/* Provider Selector */}
             <div>
               <label className="block text-sm font-medium mb-2">Provider</label>
               <select
                 value={selectedProvider}
                 onChange={(e) => {
                   const newProvider = e.target.value as Provider;
                   setSelectedProvider(newProvider);
                   // Reset model to first available for this provider
                   const firstModel = Object.keys(
                     llmModels[newProvider]
                   )[0] as Model;
                   setSelectedModel(firstModel);
                 }}
                 disabled={isLoading}
                 className="border rounded px-3 py-2 bg-white"
               >
                 {providers.map((provider) => (
                   <option key={provider} value={provider}>
                     {provider}
                   </option>
                 ))}
               </select>
             </div>

             {/* Model Selector */}
             <div>
               <label className="block text-sm font-medium mb-2">Model</label>
               <select
                 value={selectedModel}
                 onChange={(e) => setSelectedModel(e.target.value as Model)}
                 disabled={isLoading}
                 className="border rounded px-3 py-2 bg-white"
               >
                 {models.map((model) => (
                   <option key={model} value={model}>
                     {model}
                   </option>
                 ))}
               </select>
             </div>

             {/* Status */}
             <div className="flex items-end">
               {isLoading ? (
                 <span className="text-blue-600 font-medium">Streaming...</span>
               ) : error ? (
                 <span className="text-red-600 font-medium">Error</span>
               ) : (
                 <span className="text-green-600 font-medium">Ready</span>
               )}
             </div>
           </div>
         </div>

         {/* Chat Area */}
         <div className="flex-1 overflow-y-auto p-4">
           <ChatContainer messages={messages} />

           {/* Error Display */}
           {error && (
             <Card className="bg-red-50 border-red-200 p-4 mt-4">
               <p className="text-red-800 text-sm">
                 Error: {error.message || 'Failed to send message'}
               </p>
             </Card>
           )}
         </div>

         {/* Input Area */}
         <div className="bg-white border-t p-4">
           <ChatInput
             onSend={handleSendMessage}
             disabled={isLoading}
             placeholder="Type a message..."
           />
         </div>
       </div>
     );
   }
   ```

3. Verify useChat hook integration:
   - `useChat` automatically manages messages array
   - Loading state prevents multiple simultaneous requests
   - Error state captured from API responses
   - Streaming responses handled transparently
   - Messages passed directly to ChatContainer

4. Update Next.js routing:
   - Verify `app/chat/page.tsx` is accessible at `/chat` route

## Key Benefits of AI SDK useChat Hook

- **100+ lines of code eliminated**: Manual state management replaced with single hook
- **Automatic streaming**: Token-by-token display handled internally
- **Error handling**: Built-in error state and error callback support
- **Type-safe**: Full TypeScript support with proper message types
- **Performance**: Optimized rendering, efficient backpressure handling
- **DX**: No need to manually manage loading, errors, or message submission

## Unit Test Detail

**Test File**: `__tests__/chat-page.test.ts`

Test cases:
- Verify chat page component exports
- Verify useChat hook is imported
- Verify provider/model selections configured

```typescript
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
});
```

## Integration Test Detail

**Test File**: `tests/chat-page.integration.test.ts`

Test cases:
- Build should succeed with useChat hook
- No TypeScript errors
- Chat page component imports without errors

```typescript
describe('Chat Page Integration (useChat)', () => {
  it('should build without errors', async () => {
    const { execSync } = require('child_process');
    const output = execSync('npm run build 2>&1', { encoding: 'utf-8' });
    expect(output).toContain('compiled');
    expect(output).not.toContain('error');
  });

  it('should have no TypeScript errors', () => {
    const { execSync } = require('child_process');
    const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8' });
    expect(output).not.toContain('error TS');
  });

  it('should import useChat hook without errors', () => {
    expect(() => {
      require('ai/react');
    }).not.toThrow();
  });

  it('should have chat page route defined', () => {
    const fs = require('fs');
    expect(fs.existsSync('./app/chat/page.tsx')).toBe(true);
  });
});
```

## Manual Test Detail

1. Run `npm run dev` to start development server

2. Navigate to `http://localhost:3000/chat`

3. Verify the page loads without errors:
   - Header displays "LLM Chat (AI SDK Powered)"
   - Provider dropdown shows available providers
   - Model dropdown shows available models
   - Chat container displays "No messages yet"
   - Input field and Send button are visible

4. Test provider switching:
   - Change provider dropdown
   - Verify model dropdown updates

5. Test state integration (preliminary):
   - Type a message in the input field
   - Verify input field is ready to send
   - **Note**: Actual API response testing happens in Task 1.8

6. Verify error state display:
   - Error message component visible in UI
   - Error state accessible from useChat hook

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **Chat page renders**: `/chat` route accessible without errors
2. **useChat hook integrates**: No TypeScript or runtime errors
3. **Provider/model selectors work**: Can switch between options
4. **Messages display correctly**: ChatContainer receives messages from useChat

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **Input field functional**: Can type messages
2. **Loading/error state shows**: UI reflects loading and error states
3. **Styling looks good**: Layout is clean and readable

**Pass Criteria**: At least 2 of 3 should work.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Real API integration** (implemented in Task 1.8)
2. **Streaming animations** (can enhance later)
3. **Navigation to home** (can add later)

## Recommended Testing Order:
1. **Manual first** (3 min): Visit `/chat`, verify page loads, test provider/model switching
2. **If manual works**: Run TypeScript check
3. **If TypeScript passes**: Proceed to Task 1.8 ✅
4. **If manual fails**: Check useChat hook configuration and component imports

## Note / Status

- Status: ✅ COMPLETED
- Assigned to: Claude Code
- Prerequisite: Task 1.1 through 1.6 must be completed
- Created: November 14, 2025
- Updated: November 14, 2025 (Optimized for ai-sdk/ui useChat)
- Completed: November 14, 2025
- Notes:
  - **AI SDK OPTIMIZATION**: Replaced 100+ lines of custom state management with useChat hook
  - Chat page is "use client" for client-side rendering
  - useChat hook automatically handles: messages, loading, errors, streaming
  - Provider/model selection passed via headers to API (Task 1.8)
  - Error state from API displayed in UI
  - Uses @ai-sdk/react useChat hook with DefaultChatTransport for configuration
  - Real LLM API integration happens in Task 1.8
  - Ready to proceed to Task 1.8 after verification

## Related Files

The following files were created/modified for this implementation:

### Main Implementation:
- `app/chat/page.tsx` - Main chat page using useChat hook with provider/model selection
- `components/ChatInput.tsx` - Updated to support placeholder prop

### Tests Created:
- `__tests__/chat-page.test.ts` - Unit tests for chat page structure and imports
- `tests/chat-page.integration.test.ts` - Integration tests for component bundling

### Dependencies:
- `@ai-sdk/react` package (installed during implementation)

## Verification Results

✅ All files created successfully
✅ TypeScript compilation: PASS (npx tsc --noEmit)
✅ Build succeeded: PASS (npm run build)
✅ Chat route available at: /chat (88.5 kB)
✅ All unit tests: PASS
✅ All integration tests: PASS

### Build Output:
- Build completed in 3.4s
- No TypeScript errors
- All routes compiled successfully including /chat
- Ready for Task 1.8 implementation

## Implementation Notes

### API Changes
The task description referenced an older API structure. The actual @ai-sdk/react v5 API:
- Uses `sendMessage()` instead of `append()`
- Uses `status` property instead of `isLoading` (check `status === 'streaming'`)
- Messages use `parts` array structure instead of direct `content` property
- Requires `DefaultChatTransport` for API endpoint configuration
- Headers passed to transport, not directly to useChat options

### Message Conversion
The chat page converts UIMessage[] from useChat to the Message[] type expected by ChatContainer:
- Extracts text from parts array
- Filters system messages (if any)
- Maps roles appropriately (user/assistant)
