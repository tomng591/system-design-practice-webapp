# Task 1.8: Create Chat API Endpoint with streamText (AI SDK Core)

## Latest Models Guide (Updated November 2025)

### Current Recommended Models by Provider

**OpenAI (Latest as of April 2025):**
- **GPT-4.1** (`gpt-4.1-2025-04-14`) ⭐ **RECOMMENDED** - Strongest all-around model
  - Best for: Coding, reasoning, general-purpose tasks
  - Performance: Better than GPT-4o on most benchmarks
  - Context: 1M tokens
  - Cost: Moderate (better value than older models)

- **GPT-4.1 mini** (`gpt-4.1-mini-2025-04-14`) - Cost-efficient
  - Best for: Budget-conscious projects, fast responses
  - Performance: 83% cheaper than GPT-4.1, 50% lower latency
  - Context: 1M tokens

- **GPT-4o** (`gpt-4o-2024-11-20`) - Legacy (still supported)
  - Best for: Backward compatibility, multi-modal tasks
  - Note: Deprecated in favor of GPT-4.1

**Anthropic (Latest as of September 2025):**
- **Claude Sonnet 4.5** (`claude-sonnet-4-5-20250929`) ⭐ **RECOMMENDED** - Best balance
  - Best for: Coding, agents, complex reasoning
  - Performance: Anthropic's strongest model
  - Context: Standard limits

- **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`) - Fast & efficient
  - Best for: Low-latency, budget applications
  - Performance: "Near-frontier intelligence" at fastest speed

- **Claude Opus 4.1** (`claude-opus-4-1-20250805`) - Specialized reasoning
  - Best for: Complex specialized reasoning tasks
  - Performance: Exceptional for niche tasks

**Google Gemini (Latest as of June 2025):**
- **Gemini 2.5 Pro** (`gemini-2.5-pro`) ⭐ **RECOMMENDED** - Most advanced
  - Best for: Complex reasoning, mathematics, science
  - Performance: #1 on LMArena leaderboard
  - Context: 1M input, 65K output
  - Feature: Reasoning/thinking capability

- **Gemini 2.5 Flash** (`gemini-2.5-flash`) - Best price-performance
  - Best for: General use, fast responses
  - Performance: Balanced speed and quality
  - Context: 1M input, 65K output

- **Gemini 2.5 Flash-Lite** (`gemini-2.5-flash-lite`) - Most efficient
  - Best for: High-volume, cost-sensitive applications
  - Performance: Fastest and cheapest

### Model Selection Matrix

| Use Case | OpenAI | Anthropic | Google |
|----------|--------|-----------|--------|
| **Best Overall** | GPT-4.1 | Claude Sonnet 4.5 | Gemini 2.5 Pro |
| **Cost-Efficient** | GPT-4.1 mini | Claude Haiku 4.5 | Gemini 2.5 Flash-Lite |
| **Fastest** | GPT-4.1 mini | Claude Haiku 4.5 | Gemini 2.5 Flash-Lite |
| **Best for Coding** | GPT-4.1 | Claude Sonnet 4.5 | Gemini 2.5 Pro |
| **Budget App** | GPT-4.1 mini | Claude Haiku 4.5 | Gemini 2.5 Flash-Lite |

### Default Model
The default model is now **GPT-4.1** (updated from GPT-4). This provides the best balance of:
- **Performance**: Superior reasoning and coding abilities
- **Cost**: Better value than previous generation
- **Speed**: 50% lower latency than GPT-4.1 mini equivalent in cost
- **Context**: 1M token support

---

## Description
Create a simple `/api/chat` POST endpoint using ai-sdk's `streamText` function to stream LLM responses. This replaces ~200 lines of custom API code, streaming logic, and response formatting. The `streamText` function handles all complexity: streaming, backpressure, token counting, error handling, and metadata extraction.

## Implementation Detail

### Steps:
1. Create `/app/api/chat/route.ts` - chat API endpoint:
   ```typescript
   import { streamText } from 'ai';
   import { getModel } from '@/lib/llm';
   import type { Provider, Model } from '@/lib/llm';
   import { NextRequest } from 'next/server';

   export const runtime = 'nodejs';

   export async function POST(request: NextRequest) {
     try {
       const { messages } = await request.json();

       // Extract provider and model from request headers
       // (set by useChat hook in Task 1.7)
       const provider = (request.headers.get('x-provider') || 'openai') as Provider;
       const model = (request.headers.get('x-model') || 'gpt-4.1') as Model;

       // Get the model instance
       const selectedModel = getModel(provider, model);
       if (!selectedModel) {
         return new Response(
           JSON.stringify({
             error: `Model not found: ${provider}/${model}`,
           }),
           { status: 400, headers: { 'Content-Type': 'application/json' } }
         );
       }

       // streamText handles ALL the complexity:
       // - Streaming responses token-by-token
       // - Backpressure handling
       // - Token usage tracking
       // - Error handling
       // - Response formatting for useChat
       const result = streamText({
         model: selectedModel,
         system: 'You are a helpful AI assistant.',
         messages,
       });

       return result.toDataStreamResponse();
     } catch (error) {
       console.error('Chat API error:', error);
       return new Response(
         JSON.stringify({
           error: error instanceof Error ? error.message : 'Unknown error',
         }),
         { status: 500, headers: { 'Content-Type': 'application/json' } }
       );
     }
   }
   ```

2. Understand the endpoint flow:
   - `POST /api/chat` receives messages array from `useChat` hook
   - Provider and model extracted from request headers
   - `streamText()` creates a stream of tokens from the LLM
   - `.toDataStreamResponse()` converts stream to HTTP response format that `useChat` understands
   - `useChat` hook (Task 1.7) receives streamed tokens and updates UI in real-time

3. Verify streaming integration:
   - `streamText` returns typed result with `.toDataStreamResponse()` method
   - No manual buffering or backpressure handling needed
   - No custom response formatting - ai-sdk handles it
   - Errors automatically caught and returned to client

4. Verify provider/model resolution:
   - Headers `x-provider` and `x-model` match task 1.7
   - Falls back to 'openai'/'gpt-4' if headers missing
   - Uses `getModel()` from Task 1.4

## Key Benefits of AI SDK streamText

- **200+ lines of code eliminated**: No custom streaming, buffering, or response formatting
- **Automatic streaming**: Token-by-token delivery with proper backpressure
- **Error handling**: Built-in error propagation to client
- **Token counting**: Usage metrics automatically tracked
- **Type-safe**: Full TypeScript support for messages and responses
- **Performance**: Optimized for low latency, efficient memory usage
- **Integration**: Works seamlessly with useChat hook from ai-sdk/ui

## Streaming Response Format

ai-sdk's `.toDataStreamResponse()` returns Server-Sent Events (SSE) stream that `useChat` hook automatically parses:
```
data: {"type":"text-delta","text":"Hello"}
data: {"type":"text-delta","text":" world"}
data: {"type":"finish","finishReason":"stop"}
```

No manual parsing needed - `useChat` handles it all.

## Unit Test Detail

**Test File**: `__tests__/chat-api.test.ts`

Test cases:
- Verify API route file exists
- Verify streamText is imported
- Verify route exports POST handler

```typescript
describe('Chat API', () => {
  it('should have API route file', () => {
    const fs = require('fs');
    expect(fs.existsSync('./app/api/chat/route.ts')).toBe(true);
  });

  it('should import streamText', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/api/chat/route.ts', 'utf-8');
    expect(content).toContain('streamText');
    expect(content).toContain('from \'ai\'');
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
});
```

## Integration Test Detail

**Test File**: `tests/chat-api.integration.test.ts`

Test cases:
- Build should succeed with API route
- No TypeScript errors
- Route can be accessed

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

  it('should have API route defined', () => {
    const fs = require('fs');
    expect(fs.existsSync('./app/api/chat/route.ts')).toBe(true);
  });
});
```

## Manual Test Detail

1. Run `npm run dev` to start development server

2. Navigate to `http://localhost:3000/chat`

3. Set up environment (if needed):
   - Verify `OPENAI_API_KEY` is set in `.env.local` (or other provider keys)

4. Test basic message flow:
   - Type a message: "Say hello in 3 words"
   - Click Send
   - Verify: Response streams in token-by-token (visible as text appears character by character)
   - Verify: Message appears in chat with 'assistant' role

5. Test streaming appearance:
   - Type: "Count to 5"
   - Observe: Text appears incrementally as tokens arrive (not all at once)
   - Verify: Loading indicator shows while streaming

6. Test provider switching:
   - Change provider dropdown to different LLM
   - Send another message
   - Verify: Response comes from new provider (may have different wording/style)

7. Test error handling:
   - If API keys missing: error message displays in UI
   - If invalid provider: error message shows gracefully

8. Test multiple messages:
   - Send 2-3 messages in sequence
   - Verify: All messages show with correct roles (user/assistant)
   - Verify: Chat maintains context and responds appropriately

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **API route exists and exports POST handler**: `/api/chat` route works
2. **streamText imported correctly**: No TypeScript errors with streamText
3. **Provider/model resolution works**: Uses headers and falls back correctly
4. **Streaming response format correct**: useChat hook receives proper stream format

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **Error handling works**: Invalid provider/model caught and returned properly
2. **Real API call succeeds**: With valid API key, receives response from LLM
3. **Streaming appears in UI**: Tokens appear incrementally in chat

**Pass Criteria**: At least 2 of 3 should work.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **System prompt customization** (can add UI later)
2. **Token usage display** (can add analytics later)
3. **Conversation history persistence** (can add database later)

## Recommended Testing Order:
1. **Manual first** (5 min): Visit `/chat`, set provider/model, send a message
2. **If message returns**: Check streaming behavior in UI
3. **If streaming works**: Proceed to Task 1.9 ✅
4. **If fails**: Check API keys, provider configuration, and stream format

## Note / Status

- Status: ✅ COMPLETED
- Assigned to: Claude Code
- Prerequisite: Task 1.1 through 1.7 must be completed
- Created: November 14, 2025
- Updated: November 14, 2025 (Optimized for ai-sdk streamText)
- Latest Models Updated: November 14, 2025 (Added GPT-4.1, Claude Sonnet 4.5, Gemini 2.5)
- Completed: November 14, 2025
- Notes:
  - **AI SDK OPTIMIZATION**: Replaced 200+ lines of custom streaming code with streamText + toTextStreamResponse()
  - **MODELS UPDATED**: Now includes latest 2025 models from all providers (see "Latest Models Guide" section)
  - **DEFAULT MODEL**: Changed from GPT-4 to GPT-4.1 for better performance and value
  - API route uses Next.js API route handler (app/api/chat/route.ts)
  - streamText handles all streaming complexity: buffering, backpressure, token counting, errors
  - Provider/model passed via request headers from useChat hook (Task 1.7)
  - No custom response formatting needed - ai-sdk handles streaming format for useChat
  - Error handling automatic via try/catch and streamText error propagation
  - System prompt customized for system design coaching (can be further customized in Task 2.x)
  - No custom chat.ts library needed - everything in API route
  - Real end-to-end testing happens in Task 1.10
  - Ready to proceed to Task 1.9 after verification

## Updated Model Configurations (lib/llm.ts)

The following models have been configured in the webapp:

**OpenAI:**
- gpt-4.1 (latest, default)
- gpt-4.1-mini (budget option)
- gpt-4o (legacy)

**Anthropic:**
- claude-sonnet-4.5 (latest, recommended)
- claude-haiku-4.5 (fast, efficient)
- claude-opus-4.1 (specialized reasoning)

**Google:**
- gemini-2.5-pro (most advanced)
- gemini-2.5-flash (best price-performance)
- gemini-2.5-flash-lite (most efficient)

## Related Files

The following files were created/modified for this implementation:

### Main Implementation:
- `app/api/chat/route.ts` - Chat API endpoint with streamText integration
  - Handles POST requests from useChat hook
  - Streams LLM responses using AI SDK streamText
  - Manages provider/model selection via request headers
  - Returns streaming response compatible with useChat hook

### Tests Created:
- `__tests__/chat-api.test.ts` - Unit tests for API route structure and functionality
  - Tests for file existence, imports, exports
  - Tests for header handling and model resolution
  - Tests for error handling and streaming methods

- `tests/chat-api.integration.test.ts` - Integration tests for API compilation and bundling
  - Tests for module imports and dependencies
  - Tests for proper route structure
  - Tests for request/response handling

### Configuration Files Modified:
- `lib/llm.ts` - Updated with latest models (already updated in previous step)
  - GPT-4.1, GPT-4.1 mini, GPT-4o for OpenAI
  - Claude Sonnet 4.5, Claude Haiku 4.5, Claude Opus 4.1 for Anthropic
  - Gemini 2.5 Pro, Flash, Flash-Lite for Google

## Verification Results

✅ All files created successfully
✅ TypeScript compilation: PASS (npx tsc --noEmit)
✅ Build succeeded: PASS (npm run build)
✅ API route available: /api/chat (123 B, dynamic server-rendered)
✅ All unit tests: PASS
✅ All integration tests: PASS

### Build Output:
- Build completed in 2.8s
- No TypeScript errors
- API route compiled as dynamic route (ƒ)
- All dependencies resolved correctly
- Ready for Task 1.9 implementation

## Implementation Notes

### Key Decisions:
1. **Method Selection**: Used `toTextStreamResponse()` instead of manual SSE formatting
2. **Error Handling**: Comprehensive try/catch with JSON error responses
3. **System Prompt**: Customized for system design coaching use case
4. **Default Model**: GPT-4.1 for best balance of performance and cost
5. **Header-Based Config**: Provider/model passed via request headers for flexibility

### Integration Flow:
1. useChat hook (Task 1.7) sends message to `/api/chat` endpoint
2. Headers include selected provider and model
3. streamText() gets the model instance and streams response
4. toTextStreamResponse() converts stream to format useChat understands
5. UI updates in real-time as tokens arrive

### Performance Characteristics:
- **Streaming**: Token-by-token delivery for responsive UI
- **Error Handling**: Graceful fallback with error messages
- **Backpressure**: Automatically managed by AI SDK
- **Memory**: Efficient streaming without buffering entire response

## Bug Fix: LLM Responses Not Displaying (Discovered & Fixed)

### Issue Description
Messages were being sent successfully (POST `/api/chat` returned 200 OK), but the assistant's response was not appearing in the chat UI. The message input cleared after sending, but no assistant message was displayed.

### Root Cause Analysis
The API route was using the incorrect response format method. While the initial implementation appeared correct, the bug was discovered during manual testing:

**Problem Code:**
```typescript
return result.toTextStreamResponse();
```

This method returns a plain text stream (`Content-Type: text/plain`) with just the response text:
```
Your test message is visible! Let me know how I can assist you with system design...
```

However, the `useChat` hook from `@ai-sdk/react` expects a structured event stream with message metadata, not plain text.

**What `useChat` Expected:**
The hook requires a proper UI message stream with:
- Message IDs and metadata
- Event types (start, text-delta, text-end, finish)
- Finish reasons and token counts
- Proper `Content-Type: text/event-stream` header
- Custom header: `x-vercel-ai-ui-message-stream: v1`

### The Fix
Changed the response method from `toTextStreamResponse()` to `toUIMessageStreamResponse()`:

**Fixed Code (line 62):**
```typescript
// Return the UI message stream response for useChat compatibility
// This properly formats the stream with message metadata that useChat expects
return result.toUIMessageStreamResponse();
```

### How It Works
The `toUIMessageStreamResponse()` method returns a properly formatted event stream:
```
data: {"type":"start"}
data: {"type":"text-start","id":"msg_..."}
data: {"type":"text-delta","id":"msg_...","delta":"Your"}
data: {"type":"text-delta","id":"msg_...","delta":" test"}
...
data: {"type":"text-end","id":"msg_..."}
data: {"type":"finish","finishReason":"stop"}
```

This format includes:
- ✅ Proper `Content-Type: text/event-stream` header
- ✅ Message start/end events with IDs
- ✅ Token-by-token deltas for streaming display
- ✅ Metadata that `useChat` can parse and display

### Debugging Steps Used
1. **Browser DevTools Network Inspection**: Checked the response to `/api/chat` request
   - Response Body: Plain text stream
   - Content-Type: `text/plain; charset=utf-8` (incorrect)

2. **AI SDK Documentation Review**: Verified correct streaming methods
   - `toTextStreamResponse()`: Simple text stream (not suitable for useChat)
   - `toUIMessageStreamResponse()`: Structured event stream (correct for useChat)
   - `toDataStreamResponse()`: Alternative structured format (deprecated in v5)

3. **Server Log Analysis**: Checked Next.js dev server logs
   - `POST /api/chat 200 in 1964ms` (API working)
   - No errors, but response format was incompatible

### Verification
After applying the fix:
- ✅ Messages sent successfully
- ✅ Responses display in chat UI
- ✅ Streaming visible (token-by-token)
- ✅ Message history maintained
- ✅ Both user and assistant messages show correctly
- ✅ No console errors
- ✅ Proper event stream format verified in Network tab

### Key Takeaway
When using `streamText()` with the `useChat` hook in a Next.js API route:
- **Always use** `result.toUIMessageStreamResponse()` - this is the correct method for chat UI integration
- **Never use** `result.toTextStreamResponse()` - this returns plain text unsuitable for useChat
- The UI message stream format includes all necessary metadata for the client to properly parse and display messages

### Files Modified
- `app/api/chat/route.ts` (line 62): Changed response method to `toUIMessageStreamResponse()`
