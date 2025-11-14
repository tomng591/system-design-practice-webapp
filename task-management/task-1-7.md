# Task 1.7: Create Chat Page and State Management

## Description
Build the main chat page with message state management, provider/model selection, and integration of chat components. This page serves as the primary user interface for testing LLM functionality.

## Implementation Detail

### Steps:
1. Create `app/chat/page.tsx` - main chat page:
   ```typescript
   'use client';

   import { useState, useCallback } from 'react';
   import { ChatContainer, ChatInput, type Message } from '@/components/index';
   import { Button } from '@/components/ui/button';
   import { availableModels, providers } from '@/lib/llm-config';

   export default function ChatPage() {
     const [messages, setMessages] = useState<Message[]>([]);
     const [selectedProvider, setSelectedProvider] = useState(providers[0]);
     const [selectedModel, setSelectedModel] = useState(
       availableModels[selectedProvider as keyof typeof availableModels][0]
     );
     const [isLoading, setIsLoading] = useState(false);

     const handleSendMessage = useCallback(
       async (message: string) => {
         // Add user message
         const userMessage: Message = {
           id: `user-${Date.now()}`,
           role: 'user',
           content: message,
         };
         setMessages((prev) => [...prev, userMessage]);
         setIsLoading(true);

         try {
           // API call will be implemented in Task 1.8
           // For now, just log the message
           console.log('Sending to:', selectedProvider, selectedModel, message);

           // Placeholder: add assistant response after 1 second
           setTimeout(() => {
             const assistantMessage: Message = {
               id: `assistant-${Date.now()}`,
               role: 'assistant',
               content: 'Response will come from LLM (Task 1.8)',
             };
             setMessages((prev) => [...prev, assistantMessage]);
             setIsLoading(false);
           }, 1000);
         } catch (error) {
           console.error('Error sending message:', error);
           setIsLoading(false);
         }
       },
       [selectedProvider, selectedModel]
     );

     const handleProviderChange = (provider: string) => {
       setSelectedProvider(provider);
       // Reset model to first available model for this provider
       const models = availableModels[provider as keyof typeof availableModels];
       setSelectedModel(models[0]);
     };

     const handleModelChange = (model: string) => {
       setSelectedModel(model);
     };

     const models = availableModels[selectedProvider as keyof typeof availableModels];

     return (
       <div className="flex flex-col h-screen bg-gray-50">
         {/* Header */}
         <div className="bg-white border-b p-4">
           <h1 className="text-2xl font-bold mb-4">LLM Chat</h1>

           {/* Provider and Model Selection */}
           <div className="flex gap-4">
             {/* Provider Selector */}
             <div>
               <label className="block text-sm font-medium mb-2">Provider</label>
               <select
                 value={selectedProvider}
                 onChange={(e) => handleProviderChange(e.target.value)}
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
                 onChange={(e) => handleModelChange(e.target.value)}
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
                 <span className="text-blue-600 font-medium">Loading...</span>
               ) : (
                 <span className="text-green-600 font-medium">Ready</span>
               )}
             </div>
           </div>
         </div>

         {/* Chat Area */}
         <div className="flex-1 overflow-y-auto p-4">
           <ChatContainer messages={messages} />
         </div>

         {/* Input Area */}
         <div className="bg-white border-t p-4">
           <ChatInput onSend={handleSendMessage} disabled={isLoading} />
         </div>
       </div>
     );
   }
   ```

2. Verify state management:
   - Messages array stores all messages
   - Provider and model selections are tracked
   - Loading state prevents multiple simultaneous requests
   - Callbacks properly update state

3. Update Next.js routing:
   - Verify `app/chat/page.tsx` can be accessed at `/chat` route

4. Test routing:
   - Navigation from home page to chat (can add link later)

## Unit Test Detail

**Test File**: `__tests__/chat-page.test.ts`

Test cases:
- Verify chat page component exports
- Verify state management hooks are used
- Verify provider/model selections work

```typescript
describe('Chat Page', () => {
  it('should export default component', () => {
    const page = require('../app/chat/page').default;
    expect(page).toBeDefined();
    expect(typeof page).toBe('function');
  });

  it('should use React hooks', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/chat/page.tsx', 'utf-8');
    expect(content).toContain('useState');
    expect(content).toContain('useCallback');
  });

  it('should import chat components', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/chat/page.tsx', 'utf-8');
    expect(content).toContain('ChatContainer');
    expect(content).toContain('ChatInput');
  });

  it('should have provider and model selectors', () => {
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
- Build should succeed with chat page
- No TypeScript errors
- Chat page component can be imported
- Routing to /chat works

```typescript
describe('Chat Page Integration', () => {
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
   - Header displays "LLM Chat"
   - Provider dropdown shows available providers (openai, anthropic, google)
   - Model dropdown shows available models
   - Chat container displays "No messages yet"
   - Input field and Send button are visible

4. Test provider switching:
   - Change provider dropdown
   - Verify model dropdown updates to show models for selected provider

5. Test message input (placeholder):
   - Type a message in the input field
   - Click Send button
   - Verify message appears in chat as user message
   - Verify loading indicator shows briefly
   - Verify placeholder assistant response appears

6. Test state persistence:
   - Send multiple messages
   - Verify all messages display in order
   - Verify auto-scroll to latest message

7. Test loading state:
   - While loading, verify Send button is disabled
   - Verify provider/model selectors are disabled

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **Chat page renders**: `/chat` route accessible and displays without errors
2. **Provider selector works**: Can switch between providers
3. **Model selector works**: Shows correct models for selected provider
4. **Messages display**: User messages appear in chat with correct styling

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **Input field functional**: Can type and send messages
2. **Loading state works**: Shows "Loading..." while processing
3. **Styling looks good**: Layout is clean and readable

**Pass Criteria**: At least 2 of 3 should work.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Real API integration** (will be implemented in Task 1.8)
2. **Message persistence** (can save to database later)
3. **Back button to home** (can add navigation later)

## Recommended Testing Order:
1. **Manual first** (3 min): Visit `/chat`, test provider/model switching, send test message
2. **If manual works**: Run TypeScript check
3. **If TypeScript passes**: Proceed to Task 1.8 ✅
4. **If manual fails**: Check file paths and state management logic

## Note / Status

- Status: ⏳ PENDING
- Assigned to: [Team Member]
- Prerequisite: Task 1.1 through 1.6 must be completed
- Created: November 14, 2025
- Notes:
  - Chat page is "use client" for client-side rendering
  - State management uses React hooks (useState, useCallback)
  - Placeholder message handling - real LLM calls added in Task 1.8
  - Provider/model selection dynamically updates available options
  - Ready to proceed to Task 1.8 after verification
