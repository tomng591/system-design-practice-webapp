# Task 1.9: Add Error Handling and User Feedback

## Description
Improve robustness by adding comprehensive error handling, input validation, and user-friendly feedback mechanisms. This includes toast notifications for errors, validation before sending messages, and improved logging for debugging.

## Implementation Detail

### Steps:
1. Add Toast/Alert component from shadcn/ui:
   ```bash
   npx shadcn-ui@latest add toast
   npx shadcn-ui@latest add use-toast
   ```

2. Create `lib/validation.ts` - input validation:
   ```typescript
   export interface ValidationResult {
     valid: boolean;
     error?: string;
   }

   export function validateMessage(message: string): ValidationResult {
     if (!message) {
       return { valid: false, error: 'Message cannot be empty' };
     }

     if (typeof message !== 'string') {
       return { valid: false, error: 'Message must be text' };
     }

     if (message.trim().length === 0) {
       return { valid: false, error: 'Message cannot contain only whitespace' };
     }

     if (message.length > 5000) {
       return { valid: false, error: 'Message exceeds maximum length (5000 chars)' };
     }

     return { valid: true };
   }

   export function validateProvider(provider: string): ValidationResult {
     if (!provider) {
       return { valid: false, error: 'Provider must be selected' };
     }

     return { valid: true };
   }

   export function validateModel(model: string): ValidationResult {
     if (!model) {
       return { valid: false, error: 'Model must be selected' };
     }

     return { valid: true };
   }
   ```

3. Create `lib/logging.ts` - structured logging:
   ```typescript
   type LogLevel = 'debug' | 'info' | 'warn' | 'error';

   function log(level: LogLevel, message: string, data?: any) {
     const timestamp = new Date().toISOString();
     const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

     if (level === 'error') {
       console.error(`${prefix} ${message}`, data);
     } else if (level === 'warn') {
       console.warn(`${prefix} ${message}`, data);
     } else if (level === 'debug') {
       console.debug(`${prefix} ${message}`, data);
     } else {
       console.log(`${prefix} ${message}`, data);
     }
   }

   export const logger = {
     debug: (message: string, data?: any) => log('debug', message, data),
     info: (message: string, data?: any) => log('info', message, data),
     warn: (message: string, data?: any) => log('warn', message, data),
     error: (message: string, data?: any) => log('error', message, data),
   };
   ```

4. Create `components/ErrorMessage.tsx` - inline error display:
   ```typescript
   'use client';

   interface ErrorMessageProps {
     message: string;
     onDismiss?: () => void;
   }

   export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
     return (
       <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex justify-between items-center">
         <span>{message}</span>
         {onDismiss && (
           <button onClick={onDismiss} className="text-red-800 font-bold">
             ×
           </button>
         )}
       </div>
     );
   }
   ```

5. Update `app/chat/page.tsx` to use validation and error handling:
   ```typescript
   'use client';

   import { useState, useCallback } from 'react';
   import { ChatContainer, ChatInput, type Message } from '@/components/index';
   import { Button } from '@/components/ui/button';
   import { ErrorMessage } from '@/components/ErrorMessage';
   import { availableModels, providers } from '@/lib/llm-config';
   import { sendMessage } from '@/lib/chat';
   import { validateMessage, validateProvider, validateModel } from '@/lib/validation';
   import { logger } from '@/lib/logging';
   import type { Provider } from '@/lib/llm';

   export default function ChatPage() {
     const [messages, setMessages] = useState<Message[]>([]);
     const [selectedProvider, setSelectedProvider] = useState(providers[0]);
     const [selectedModel, setSelectedModel] = useState(
       availableModels[selectedProvider as keyof typeof availableModels][0]
     );
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const handleSendMessage = useCallback(
       async (message: string) => {
         try {
           // Reset previous error
           setError(null);

           // Validate inputs
           const messageValidation = validateMessage(message);
           if (!messageValidation.valid) {
             logger.warn('Invalid message', { message, error: messageValidation.error });
             setError(messageValidation.error || 'Invalid message');
             return;
           }

           const providerValidation = validateProvider(selectedProvider);
           if (!providerValidation.valid) {
             setError(providerValidation.error || 'Invalid provider');
             return;
           }

           const modelValidation = validateModel(selectedModel);
           if (!modelValidation.valid) {
             setError(modelValidation.error || 'Invalid model');
             return;
           }

           // Add user message
           const userMessage: Message = {
             id: `user-${Date.now()}`,
             role: 'user',
             content: message,
           };
           setMessages((prev) => [...prev, userMessage]);
           setIsLoading(true);

           logger.info('Sending message', {
             provider: selectedProvider,
             model: selectedModel,
             messageLength: message.length,
           });

           // Call LLM
           const response = await sendMessage({
             message,
             provider: selectedProvider as Provider,
             model: selectedModel,
           });

           logger.info('Received response', {
             provider: response.provider,
             contentLength: response.content.length,
           });

           const assistantMessage: Message = {
             id: `assistant-${Date.now()}`,
             role: 'assistant',
             content: response.content,
           };
           setMessages((prev) => [...prev, assistantMessage]);
         } catch (err) {
           const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
           logger.error('Chat error', { error: errorMessage });
           setError(errorMessage);

           // Add error message to chat for visibility
           const errorChatMessage: Message = {
             id: `error-${Date.now()}`,
             role: 'assistant',
             content: `Error: ${errorMessage}`,
           };
           setMessages((prev) => [...prev, errorChatMessage]);
         } finally {
           setIsLoading(false);
         }
       },
       [selectedProvider, selectedModel]
     );

     const handleProviderChange = (provider: string) => {
       setSelectedProvider(provider);
       const models = availableModels[provider as keyof typeof availableModels];
       setSelectedModel(models[0]);
       setError(null);
     };

     const handleModelChange = (model: string) => {
       setSelectedModel(model);
       setError(null);
     };

     const models = availableModels[selectedProvider as keyof typeof availableModels];

     return (
       <div className="flex flex-col h-screen bg-gray-50">
         {/* Header */}
         <div className="bg-white border-b p-4">
           <h1 className="text-2xl font-bold mb-4">LLM Chat</h1>

           {/* Error Message */}
           {error && (
             <ErrorMessage
               message={error}
               onDismiss={() => setError(null)}
             />
           )}

           {/* Provider and Model Selection */}
           <div className="flex gap-4">
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

6. Create `.env.example` update:
   - Document that valid API keys are needed
   - Add logging configuration if needed

## Unit Test Detail

**Test File**: `__tests__/validation.test.ts`

Test cases:
- Verify validation functions work correctly
- Verify error messages are user-friendly
- Verify logging module exports correct functions

```typescript
describe('Validation & Error Handling', () => {
  it('should validate non-empty messages', () => {
    const { validateMessage } = require('../lib/validation');
    const result = validateMessage('hello');
    expect(result.valid).toBe(true);
  });

  it('should reject empty messages', () => {
    const { validateMessage } = require('../lib/validation');
    const result = validateMessage('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject whitespace-only messages', () => {
    const { validateMessage } = require('../lib/validation');
    const result = validateMessage('   ');
    expect(result.valid).toBe(false);
  });

  it('should reject messages over 5000 chars', () => {
    const { validateMessage } = require('../lib/validation');
    const longMessage = 'a'.repeat(5001);
    const result = validateMessage(longMessage);
    expect(result.valid).toBe(false);
  });

  it('should export logger with all levels', () => {
    const { logger } = require('../lib/logging');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });
});
```

## Integration Test Detail

**Test File**: `tests/error-handling.integration.test.ts`

Test cases:
- Build should succeed with validation and logging
- No TypeScript errors
- Components render without errors

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

  it('should import validation module', () => {
    expect(() => require('../lib/validation')).not.toThrow();
  });

  it('should import logging module', () => {
    expect(() => require('../lib/logging')).not.toThrow();
  });
});
```

## Manual Test Detail

1. Start dev server: `npm run dev`

2. Navigate to `http://localhost:3000/chat`

3. Test input validation:
   - Try to send empty message (click Send without typing)
   - Verify error appears: "Message cannot be empty"
   - Type spaces only and click Send
   - Verify error appears: "Message cannot contain only whitespace"

4. Test long message:
   - Paste a very long message (>5000 chars)
   - Verify error appears: "Message exceeds maximum length"

5. Test error dismissal:
   - Trigger an error
   - Click the × button on error message
   - Verify error disappears

6. Test with invalid API key:
   - Set invalid key in `.env.local`
   - Send a message
   - Verify user-friendly error message appears
   - Check browser console for detailed logging

7. Test successful flow:
   - Set valid API key
   - Send a normal message
   - Verify response appears without errors
   - Check console logs show proper info messages

8. Test console logging:
   - Open DevTools Console
   - Send a message
   - Verify timestamps and log levels appear
   - Verify no errors logged

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **Validation functions work**: Empty, whitespace, and long messages rejected
2. **Error messages display**: User sees readable error messages in UI
3. **No TypeScript errors**: `npx tsc --noEmit` passes
4. **Build succeeds**: `npm run build` completes without errors

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **Logger works**: Messages appear in console with timestamps
2. **Error dismissal works**: × button removes error message
3. **Console shows no JS errors**: Clean DevTools console

**Pass Criteria**: At least 2 of 3 should work.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Toast notifications** (can enhance error display later)
2. **Error tracking/analytics** (can add later)
3. **User-facing error recovery suggestions** (can improve later)

## Recommended Testing Order:
1. **Manual first** (3 min): Test validation, trigger errors, check logging
2. **If manual works**: Run TypeScript check
3. **If TypeScript passes**: Proceed to Task 1.10 ✅
4. **If manual fails**: Check validation logic and error display

## Note / Status

- Status: ⏳ PENDING
- Assigned to: [Team Member]
- Prerequisite: Task 1.1 through 1.8 must be completed
- Created: November 14, 2025
- Notes:
  - Validation prevents bad data from reaching API
  - Logging helps with debugging in production
  - Error messages are user-friendly, not technical
  - ErrorMessage component is reusable across app
  - Ready to proceed to Task 1.10 after verification
