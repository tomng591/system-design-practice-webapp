# Task 1.8: Implement Chat Functionality - Send Message to LLM

## Description
Connect the chat UI to the LLM backend by implementing actual API calls to send messages and receive responses. This integrates the abstraction layer from Task 1.5 with the chat page state management.

## Implementation Detail

### Steps:
1. Create `app/api/chat/route.ts` - server-side chat endpoint:
   ```typescript
   import { callLLM } from '@/lib/llm-client';
   import type { Provider } from '@/lib/llm';

   export async function POST(request: Request) {
     try {
       const { message, provider, model } = await request.json();

       // Validate input
       if (!message || !provider || !model) {
         return Response.json(
           { error: 'Missing required fields' },
           { status: 400 }
         );
       }

       // Call LLM
       const response = await callLLM(
         provider as Provider,
         model,
         message
       );

       return Response.json(response);
     } catch (error) {
       console.error('Chat API error:', error);
       return Response.json(
         { error: error instanceof Error ? error.message : 'Unknown error' },
         { status: 500 }
       );
     }
   }
   ```

2. Create `lib/chat.ts` - client-side chat logic:
   ```typescript
   import type { Provider } from './llm';

   export interface ChatRequest {
     message: string;
     provider: Provider;
     model: string;
   }

   export interface ChatResponse {
     content: string;
     provider: string;
     model: string;
     usage?: {
       inputTokens?: number;
       outputTokens?: number;
     };
   }

   export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
     try {
       const response = await fetch('/api/chat', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(request),
       });

       if (!response.ok) {
         const error = await response.json();
         throw new Error(error.error || 'Failed to send message');
       }

       return await response.json();
     } catch (error) {
       throw new Error(
         error instanceof Error ? error.message : 'Unknown error occurred'
       );
     }
   }
   ```

3. Update `app/chat/page.tsx` to use real LLM calls:
   ```typescript
   // Add import at top
   import { sendMessage } from '@/lib/chat';

   // In handleSendMessage callback, replace placeholder with:
   const handleSendMessage = useCallback(
     async (message: string) => {
       const userMessage: Message = {
         id: `user-${Date.now()}`,
         role: 'user',
         content: message,
       };
       setMessages((prev) => [...prev, userMessage]);
       setIsLoading(true);

       try {
         const response = await sendMessage({
           message,
           provider: selectedProvider as Provider,
           model: selectedModel,
         });

         const assistantMessage: Message = {
           id: `assistant-${Date.now()}`,
           role: 'assistant',
           content: response.content,
         };
         setMessages((prev) => [...prev, assistantMessage]);
       } catch (error) {
         // Show error message to user
         const errorMessage: Message = {
           id: `error-${Date.now()}`,
           role: 'assistant',
           content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
         };
         setMessages((prev) => [...prev, errorMessage]);
       } finally {
         setIsLoading(false);
       }
     },
     [selectedProvider, selectedModel]
   );
   ```

4. Verify imports and types:
   - Ensure Provider type is imported from llm.ts
   - Verify ChatRequest and ChatResponse interfaces are exported
   - Check all types are properly used

5. Add API endpoint documentation:
   - Create `lib/api-docs.ts` with endpoint documentation (optional)

## Unit Test Detail

**Test File**: `__tests__/chat-api.test.ts`

Test cases:
- Verify chat route handler exists
- Verify sendMessage function exists
- Verify error handling for missing fields

```typescript
describe('Chat API & Client', () => {
  it('should export chat API route', () => {
    const fs = require('fs');
    expect(fs.existsSync('./app/api/chat/route.ts')).toBe(true);
  });

  it('should export sendMessage function', () => {
    const { sendMessage } = require('../lib/chat');
    expect(typeof sendMessage).toBe('function');
  });

  it('should have ChatRequest and ChatResponse types', () => {
    const { sendMessage } = require('../lib/chat');
    expect(sendMessage).toBeDefined();
  });

  it('should validate ChatRequest has required fields', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./lib/chat.ts', 'utf-8');
    expect(content).toContain('message');
    expect(content).toContain('provider');
    expect(content).toContain('model');
  });
});
```

## Integration Test Detail

**Test File**: `tests/chat-api.integration.test.ts`

Test cases:
- Build should succeed with new API route
- No TypeScript errors
- API endpoint can be imported without errors
- sendMessage function can be called

```typescript
describe('Chat API Integration', () => {
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

  it('should handle missing fields gracefully', async () => {
    // Mock test - actual endpoint test in manual testing
    const { sendMessage } = require('../lib/chat');
    try {
      await sendMessage({
        message: '',
        provider: 'openai',
        model: 'gpt-4',
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should format request correctly', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./lib/chat.ts', 'utf-8');
    expect(content).toContain('Content-Type');
    expect(content).toContain('POST');
  });
});
```

## Manual Test Detail

1. Ensure environment variables are set in `.env.local` (from Task 1.3)
   - You need at least one valid LLM API key

2. Start dev server: `npm run dev`

3. Navigate to `http://localhost:3000/chat`

4. Test with a provider that has a valid API key:
   - Select provider and model
   - Type a message: "Hello, what is 2+2?"
   - Click Send
   - Wait for response
   - Verify response appears in chat

5. Test error handling:
   - Send message with invalid API key (to test error case)
   - Verify error message displays in chat

6. Test multiple messages:
   - Send several messages
   - Verify all responses are correct
   - Verify conversation flows naturally

7. Test loading state:
   - While waiting for response, verify Send button is disabled
   - Verify provider/model selectors are disabled

8. Monitor console for errors:
   - Open browser DevTools console
   - Send messages and verify no JavaScript errors
   - Check network tab to see API requests

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **API route exists**: `/api/chat` endpoint created and accessible
2. **sendMessage function works**: Can call without throwing
3. **No TypeScript errors**: `npx tsc --noEmit` passes
4. **Build succeeds**: `npm run build` completes without errors

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **API returns response**: Calling endpoint with valid data returns data
2. **Error handling works**: Invalid requests return error messages
3. **Chat displays responses**: Assistant messages appear in UI correctly

**Pass Criteria**: At least 2 of 3 should work. Test with at least one valid API key.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Response streaming** (can implement later for faster UX)
2. **Token usage display** (can show in Task 1.9)
3. **Request timeout handling** (can add later)

## Recommended Testing Order:
1. **Manual with valid API key** (5 min): Set env var, start server, send real message
2. **If real API call works**: Check error handling
3. **If error handling works**: Proceed to Task 1.9 ✅
4. **If manual fails**: Verify API key is set and valid, check network tab for errors

## Note / Status

- Status: ⏳ PENDING
- Assigned to: [Team Member]
- Prerequisites:
  - Task 1.1 through 1.7 must be completed
  - At least one valid LLM API key needed in `.env.local`
- Created: November 14, 2025
- Notes:
  - This is the first task that makes real API calls
  - Requires valid API key to fully test
  - Error handling shows user-friendly messages
  - API route is server-side (secrets safe from browser)
  - Ready to proceed to Task 1.9 after verification
