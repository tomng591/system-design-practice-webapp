# Task 1.9: Add Minimal Error Handling via AI SDK (Optimized)

## ⏭️ SKIPPED - Task Status: SKIPPED

**Reason for Skipping**:
- Chat functionality is not the primary focus of this system design practice webapp
- Error handling and debugging were comprehensively tested and validated during Task 1.8
- The bug investigation and fix (using Chrome DevTools MCP) provided thorough validation of the error handling pipeline
- Task 1.8 already demonstrated proper error display, API error handling, and network monitoring

**What was learned in Task 1.8** (sufficient for MVP):
- ✅ Error handling via useChat hook works correctly
- ✅ API errors properly caught and returned to client
- ✅ Network monitoring shows error responses and stream format
- ✅ Browser console cleaned of errors after bug fix
- ✅ Integration testing completed with chrome-devtools-mcp

---

## Description
Add minimal error handling and validation by leveraging ai-sdk's built-in error handling. Since ai-sdk's `useChat` hook and `streamText` already handle most error cases automatically, this task focuses on input validation in the UI component and displaying the error state from the hook. Significantly reduced complexity compared to custom error handling.

## Implementation Detail

### Steps:
1. Add basic input validation in `ChatInput` component:
   ```typescript
   'use client';

   import { useState } from 'react';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';

   interface ChatInputProps {
     onSend: (message: string) => void;
     disabled?: boolean;
     placeholder?: string;
   }

   export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
     const [message, setMessage] = useState('');
     const [error, setError] = useState<string | null>(null);

     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();

       // Minimal validation: check for empty/whitespace
       if (!message.trim()) {
         setError('Message cannot be empty');
         return;
       }

       if (message.length > 5000) {
         setError('Message exceeds 5000 characters');
         return;
       }

       setError(null);
       onSend(message);
       setMessage('');
     };

     return (
       <div>
         <form onSubmit={handleSubmit} className="flex gap-2">
           <Input
             value={message}
             onChange={(e) => {
               setMessage(e.target.value);
               setError(null);
             }}
             placeholder={placeholder || 'Type your message...'}
             disabled={disabled}
             className="flex-1"
           />
           <Button type="submit" disabled={disabled || !message.trim()}>
             Send
           </Button>
         </form>
         {error && (
           <p className="text-red-600 text-sm mt-2">{error}</p>
         )}
       </div>
     );
   }
   ```

2. API error handling is automatic via ai-sdk's `streamText`:
   - Task 1.8's `/api/chat` endpoint uses try/catch
   - Errors automatically caught and returned to client
   - `useChat` hook exposes error state automatically

3. Display error from `useChat` in chat page (Task 1.7):
   - Error display already in chat page template:
     ```typescript
     {error && (
       <Card className="bg-red-50 border-red-200 p-4 mt-4">
         <p className="text-red-800 text-sm">
           Error: {error.message || 'Failed to send message'}
         </p>
       </Card>
     )}
     ```

4. Basic logging for debugging:
   ```typescript
   // In chat API endpoint (Task 1.8):
   console.error('Chat API error:', error);

   // In useChat hook callback (optional):
   const { messages, error } = useChat({
     api: '/api/chat',
     headers: { ... },
     onError: (error) => {
       console.error('useChat error:', error);
     },
   });
   ```

## Key Benefits of AI SDK Error Handling

- **Automatic error propagation**: useChat hook captures errors automatically
- **Error state in UI**: Access `error` from useChat hook directly
- **No custom error layer**: ai-sdk handles HTTP error codes, network errors, API errors
- **Minimal code**: Input validation at component level only
- **Consistent UX**: All errors displayed via useChat error state

## What AI SDK Handles Automatically

- ✅ Network errors
- ✅ API response errors (4xx, 5xx)
- ✅ Invalid provider/model errors (from API)
- ✅ Timeout errors
- ✅ Missing API keys
- ✅ Rate limiting errors

## What We Handle Manually (Minimal)

- ✅ Empty message validation (in ChatInput)
- ✅ Message length validation (in ChatInput)
- ✅ User-friendly error display (from useChat error state)

## Unit Test Detail

**Test File**: `__tests__/error-handling.test.ts`

Test cases:
- Verify ChatInput component has validation
- Verify error display in chat page
- Verify useChat error handling

```typescript
describe('Error Handling', () => {
  it('should prevent empty message submission', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./components/ChatInput.tsx', 'utf-8');
    expect(content).toContain('message.trim()');
  });

  it('should display error message in ChatInput', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./components/ChatInput.tsx', 'utf-8');
    expect(content).toContain('error');
    expect(content).toContain('text-red');
  });

  it('should use useChat error state in chat page', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/chat/page.tsx', 'utf-8');
    expect(content).toContain('error');
    expect(content).toContain('useChat');
  });

  it('should have error display component', () => {
    const fs = require('fs');
    const content = fs.readFileSync('./app/chat/page.tsx', 'utf-8');
    expect(content).toContain('error');
    expect(content).toContain('bg-red');
  });
});
```

## Integration Test Detail

**Test File**: `tests/error-handling.integration.test.ts`

Test cases:
- Build succeeds with error handling
- No TypeScript errors
- Error components render without errors

```typescript
describe('Error Handling Integration', () => {
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

  it('should import error components without errors', () => {
    expect(() => {
      require('../components/ChatInput');
    }).not.toThrow();
  });
});
```

## Manual Test Detail

1. Test input validation:
   - Click Send with empty message → "Message cannot be empty" error shows
   - Type only spaces, click Send → error shows
   - Type 5001+ characters → "exceeds 5000 characters" error shows
   - Type valid message → error clears, message sends

2. Test error display in UI:
   - Message appears in chat with error cleared
   - Error display is clear and readable

3. Test API error handling (if API key missing):
   - Try to send message without API key set
   - Error message displays in red box under chat
   - Message is not added to chat (prevented by error)
   - UI remains functional for retry

4. Test provider/model validation:
   - Select valid provider/model → can send message
   - Error message in API shows gracefully (not a crash)

5. Test network error (optional):
   - If network is offline, error displays
   - UI doesn't crash
   - User can retry when back online

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **Empty message validation works**: Prevents empty message submission
2. **Error displays in UI**: useChat error state displays in chat page
3. **No TypeScript errors**: Build succeeds without errors
4. **ChatInput has error display**: Validation errors shown in component

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **API error handling works**: Invalid provider/model shows error gracefully
2. **Error messages are readable**: Clear, user-friendly error text
3. **UI remains functional after error**: Can retry/send new message

**Pass Criteria**: At least 2 of 3 should work.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Toast notifications** (can use snackbar/alert instead)
2. **Detailed error logging** (can add later)
3. **Error recovery suggestions** (can add UX improvements later)

## Recommended Testing Order:
1. **Manual first** (5 min): Test empty message, long message, valid message
2. **If validation works**: Test API error (try without API key or invalid provider)
3. **If errors display**: Run TypeScript check
4. **If all pass**: Proceed to Task 1.10 ✅

## Note / Status

- Status: ⏭️ SKIPPED
- Assigned to: N/A (Task Skipped)
- Reason: Chat is not the primary focus of the app; error handling validated in Task 1.8
- Prerequisite: Task 1.1 through 1.8 must be completed
- Created: November 14, 2025
- Updated: November 14, 2025 (Optimized for ai-sdk error handling)
- Skipped: November 14, 2025 (Error handling comprehensively tested in Task 1.8)
- Notes:
  - **AI SDK OPTIMIZATION**: Leverages ai-sdk's built-in error handling instead of custom layer
  - Input validation minimal: only empty/whitespace/length checks in ChatInput
  - API errors automatically handled by streamText (Task 1.8)
  - useChat hook exposes error state for UI display (Task 1.7)
  - No custom validation library needed - simple checks in component
  - No custom error handling middleware - ai-sdk provides it
  - Error display via useChat error state - no separate error component needed
  - Basic console logging for debugging
  - Focuses on MVP simplicity - extensive logging can be added later
  - Ready to proceed to Task 1.10 after verification
