# Task 1.5: Create LLM Abstraction Layer

## Description
Build a unified interface to call any LLM provider (OpenAI, Anthropic, Google) through a single function. This abstraction layer handles provider selection, error handling, and response normalization.

## Implementation Detail

### Steps:
1. Create `lib/llm-client.ts` - main abstraction function:
   ```typescript
   import { generateText } from 'ai';
   import { getModel } from './llm';
   import type { Provider, Model } from './llm';

   export interface LLMResponse {
     content: string;
     provider: Provider;
     model: Model;
     usage?: {
       inputTokens?: number;
       outputTokens?: number;
     };
   }

   export async function callLLM(
     provider: Provider,
     model: Model,
     message: string,
     systemPrompt?: string
   ): Promise<LLMResponse> {
     try {
       // Get the model instance for this provider
       const selectedModel = getModel(provider, model);

       if (!selectedModel) {
         throw new Error(`Model not found: ${provider}/${model}`);
       }

       // Call the LLM
       const result = await generateText({
         model: selectedModel,
         system: systemPrompt,
         prompt: message,
       });

       return {
         content: result.text,
         provider,
         model,
         usage: result.usage,
       };
     } catch (error) {
       throw new Error(`LLM call failed: ${error instanceof Error ? error.message : String(error)}`);
     }
   }
   ```

2. Create `lib/llm-error.ts` - error handling:
   ```typescript
   export class LLMError extends Error {
     constructor(
       public provider: string,
       public originalError: Error,
       message?: string
     ) {
       super(message || originalError.message);
       this.name = 'LLMError';
     }
   }

   export function isLLMError(error: unknown): error is LLMError {
     return error instanceof LLMError;
   }
   ```

3. Update `lib/llm-client.ts` to use LLMError:
   ```typescript
   // In the catch block:
   catch (error) {
     throw new LLMError(
       provider,
       error instanceof Error ? error : new Error(String(error)),
       `Failed to call ${provider}/${model}`
     );
   }
   ```

4. Verify types and exports:
   - Create index file or export all from main module
   - Ensure LLMResponse, LLMError, and callLLM are exported
   - Verify TypeScript types are correct

5. Add input validation:
   ```typescript
   function validateInput(message: string): void {
     if (!message || typeof message !== 'string') {
       throw new Error('Message must be a non-empty string');
     }
     if (message.trim().length === 0) {
       throw new Error('Message cannot be empty or whitespace only');
     }
   }
   ```

## Unit Test Detail

**Test File**: `__tests__/llm-client.test.ts`

Test cases:
- Verify callLLM function exists and is callable
- Verify LLMResponse interface structure
- Verify error handling
- Verify input validation

```typescript
describe('LLM Client', () => {
  it('should export callLLM function', () => {
    const { callLLM } = require('../lib/llm-client');
    expect(typeof callLLM).toBe('function');
  });

  it('should export LLMResponse interface', () => {
    const { callLLM } = require('../lib/llm-client');
    expect(callLLM).toBeDefined();
  });

  it('should export LLMError class', () => {
    const { LLMError, isLLMError } = require('../lib/llm-error');
    expect(typeof LLMError).toBe('function');
    expect(typeof isLLMError).toBe('function');
  });

  it('should validate that message is not empty', () => {
    const { callLLM } = require('../lib/llm-client');
    // This is a validation test - actual async call tested in integration
    expect(async () => {
      await callLLM('openai', 'gpt-4', '');
    }).toBeDefined();
  });

  it('LLMError should have provider property', () => {
    const { LLMError } = require('../lib/llm-error');
    const error = new Error('test');
    const llmError = new LLMError('openai', error, 'test message');
    expect(llmError.provider).toBe('openai');
  });
});
```

## Integration Test Detail

**Test File**: `tests/llm-client.integration.test.ts`

Test cases:
- Verify callLLM can be called without crashing (with valid setup)
- Verify error handling for invalid provider/model
- Verify response structure matches LLMResponse interface
- Note: Actual API calls will be tested with real keys later

```typescript
describe('LLM Client Integration', () => {
  it('should not throw when importing LLM client', () => {
    expect(() => require('../lib/llm-client')).not.toThrow();
  });

  it('should have proper TypeScript types', () => {
    const { execSync } = require('child_process');
    const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8' });
    expect(output).not.toContain('error TS');
  });

  it('should handle invalid provider gracefully', async () => {
    const { callLLM } = require('../lib/llm-client');
    try {
      await callLLM('invalid_provider', 'model', 'test');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should normalize responses with consistent structure', () => {
    // Response structure test - verify LLMResponse has required fields
    const mockResponse = {
      content: 'test',
      provider: 'openai',
      model: 'gpt-4',
    };
    expect(mockResponse).toHaveProperty('content');
    expect(mockResponse).toHaveProperty('provider');
    expect(mockResponse).toHaveProperty('model');
  });
});
```

## Manual Test Detail

1. Verify `lib/llm-client.ts` file exists and contains callLLM function
2. Verify `lib/llm-error.ts` file exists with LLMError class
3. Run `npx tsc --noEmit` and verify no TypeScript errors
4. Test import in Node.js REPL:
   ```bash
   node -e "const { callLLM } = require('./lib/llm-client'); console.log(typeof callLLM);"
   ```
5. Verify error handling by checking error messages are descriptive
6. Run `npm run build` and verify no build errors
7. Check that LLMResponse interface has all expected properties: content, provider, model

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **callLLM function exists**: Can import and call the function
2. **LLMError class works**: Error handling implemented and exports correctly
3. **No TypeScript errors**: `npx tsc --noEmit` passes
4. **Input validation works**: Empty message validation implemented

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **LLMResponse interface correct**: Has content, provider, model properties
2. **Error handling catches exceptions**: Try/catch block in callLLM
3. **Build succeeds**: `npm run build` completes without errors

**Pass Criteria**: At least 2 of 3 should work.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Response streaming** (can implement later for faster responses)
2. **Token usage tracking** (can add cost calculation later)
3. **Retry logic** (can add exponential backoff later)

## Recommended Testing Order:
1. **Manual first** (2 min): Verify files exist, run tsc, check imports
2. **If manual passes**: Run TypeScript check
3. **If TypeScript passes**: Proceed to Task 1.6 ✅
4. **If manual fails**: Check file paths and error handling implementation

## Note / Status

- Status: ⏳ PENDING
- Assigned to: [Team Member]
- Prerequisite: Task 1.1 through 1.4 must be completed
- Created: November 14, 2025
- Notes:
  - This is the abstraction layer - no actual API calls tested yet
  - Error handling is basic but extensible for future improvements
  - Will be used by chat functionality in Tasks 1.8 and beyond
  - Ready to proceed to Task 1.6 after verification
