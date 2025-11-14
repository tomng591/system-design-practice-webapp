# Task 1.4: Install and Set Up ai-sdk

## Description
Install and configure Vercel's ai-sdk to provide unified LLM integration. The ai-sdk abstracts away differences between OpenAI, Anthropic, and Google APIs, allowing seamless provider switching.

## Implementation Detail

### Steps:
1. Install ai-sdk and provider packages:
   ```bash
   npm install ai
   npm install @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google
   ```

2. Create `lib/llm.ts` - LLM provider initialization:
   ```typescript
   import { openai } from '@ai-sdk/openai';
   import { anthropic } from '@ai-sdk/anthropic';
   import { google } from '@ai-sdk/google';

   export const llmModels = {
     openai: {
       'gpt-4': openai('gpt-4'),
       'gpt-3.5-turbo': openai('gpt-3.5-turbo'),
     },
     anthropic: {
       'claude-3-opus': anthropic('claude-3-opus-20240229'),
       'claude-3-sonnet': anthropic('claude-3-sonnet-20240229'),
     },
     google: {
       'gemini-pro': google('gemini-pro'),
       'gemini-1.5-pro': google('gemini-1.5-pro'),
     },
   };

   export type Provider = keyof typeof llmModels;
   export type Model = string;

   export function getModel(provider: Provider, model: Model) {
     return llmModels[provider]?.[model];
   }
   ```

3. Verify TypeScript types are correct:
   - Run `npx tsc --noEmit` and verify no errors
   - Check that model keys are properly typed

4. Create `lib/llm-config.ts` to map available models:
   ```typescript
   export const availableModels = {
     openai: ['gpt-4', 'gpt-3.5-turbo'],
     anthropic: ['claude-3-opus', 'claude-3-sonnet'],
     google: ['gemini-pro', 'gemini-1.5-pro'],
   };

   export const providers = Object.keys(availableModels);
   ```

5. Verify imports work correctly:
   - Create test file to verify imports don't throw
   - Check that ai-sdk package.json version is correct

## Unit Test Detail

**Test File**: `__tests__/llm-setup.test.ts`

Test cases:
- Verify ai-sdk packages are installed
- Verify provider modules can be imported
- Verify model configuration has correct structure
- Verify type exports are available

```typescript
describe('ai-sdk Setup', () => {
  it('should have ai-sdk installed', () => {
    const pkg = require('../package.json');
    expect(pkg.dependencies).toHaveProperty('ai');
  });

  it('should have all provider packages installed', () => {
    const pkg = require('../package.json');
    expect(pkg.dependencies).toHaveProperty('@ai-sdk/openai');
    expect(pkg.dependencies).toHaveProperty('@ai-sdk/anthropic');
    expect(pkg.dependencies).toHaveProperty('@ai-sdk/google');
  });

  it('should export llmModels with all providers', () => {
    const { llmModels } = require('../lib/llm');
    expect(llmModels).toHaveProperty('openai');
    expect(llmModels).toHaveProperty('anthropic');
    expect(llmModels).toHaveProperty('google');
  });

  it('should have available models defined', () => {
    const { availableModels } = require('../lib/llm-config');
    expect(availableModels.openai.length).toBeGreaterThan(0);
    expect(availableModels.anthropic.length).toBeGreaterThan(0);
    expect(availableModels.google.length).toBeGreaterThan(0);
  });

  it('should export getModel function', () => {
    const { getModel } = require('../lib/llm');
    expect(typeof getModel).toBe('function');
  });
});
```

## Integration Test Detail

**Test File**: `tests/llm-integration.test.ts`

Test cases:
- Build should succeed with ai-sdk imports
- TypeScript compilation should pass
- Model retrieval function should work correctly

```typescript
describe('ai-sdk Integration', () => {
  it('should build successfully with ai-sdk', async () => {
    const { execSync } = require('child_process');
    const output = execSync('npm run build 2>&1', { encoding: 'utf-8' });
    expect(output).toContain('compiled');
    expect(output).not.toContain('error');
  });

  it('should not have TypeScript errors', () => {
    const { execSync } = require('child_process');
    const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8' });
    expect(output).not.toContain('error TS');
  });

  it('getModel should return model object for valid provider/model', () => {
    const { getModel } = require('../lib/llm');
    const model = getModel('openai', 'gpt-4');
    expect(model).toBeDefined();
  });

  it('getModel should return undefined for invalid provider', () => {
    const { getModel } = require('../lib/llm');
    const model = getModel('invalid', 'model');
    expect(model).toBeUndefined();
  });
});
```

## Manual Test Detail

1. Run `npm install` and verify all ai-sdk packages install successfully
2. Run `npx tsc --noEmit` and verify no TypeScript errors
3. Verify `lib/llm.ts` file exists and contains model definitions
4. Verify `lib/llm-config.ts` file exists with availableModels
5. Open Node.js REPL and test:
   ```bash
   node -e "const llm = require('./lib/llm.ts'); console.log(Object.keys(llm.llmModels));"
   ```
6. Run `npm run build` and verify build succeeds
7. Verify no runtime errors when importing the modules

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **ai-sdk packages installed**: All three provider packages in node_modules
2. **No TypeScript errors**: `npx tsc --noEmit` passes
3. **llm.ts module loads**: Can import without runtime errors
4. **Build succeeds**: `npm run build` completes without errors

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **Model configuration defined**: availableModels has all providers
2. **getModel function works**: Returns model objects correctly
3. **Provider types exported**: Can import Provider type without errors

**Pass Criteria**: At least 2 of 3 should work.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Additional models configured** (can add more model options later)
2. **Model validation layer** (can add validation later)

## Recommended Testing Order:
1. **Manual first** (2 min): Run npm install, run tsc check, verify build
2. **If manual passes**: Check TypeScript types work correctly
3. **If TypeScript passes**: Proceed to Task 1.5 ✅
4. **If manual fails**: Check for installation errors, verify package names

## Note / Status

- Status: ✅ COMPLETED
- Assigned to: [Team Member]
- Prerequisite: Task 1.1, 1.2, 1.3 must be completed
- Created: November 14, 2025
- Completed: November 14, 2025
- Notes:
  - ai-sdk and all provider packages successfully installed
  - Model definitions created for OpenAI, Anthropic, and Google
  - All 7 unit tests passing
  - All 7 integration tests passing
  - TypeScript check passing with no errors
  - Production build successful (✓ Compiled successfully in 2.1s)
  - Ready to proceed to Task 1.5

## Related Files

This task involved the creation and modification of the following files:

### Configuration Files
- `jest.config.js` - Updated test environment from jsdom to node for ai-sdk compatibility

### LLM Library Modules
- `lib/llm.ts` - LLM provider initialization with model definitions
- `lib/llm-config.ts` - Available models configuration and provider list

### Test Files
- `__tests__/llm-setup.test.ts` - Unit tests for ai-sdk setup (7/7 passing)
- `tests/llm-integration.test.ts` - Integration tests for LLM module (7/7 passing)

### Dependencies
- `ai` - Vercel's ai-sdk package
- `@ai-sdk/openai` - OpenAI provider for ai-sdk
- `@ai-sdk/anthropic` - Anthropic provider for ai-sdk
- `@ai-sdk/google` - Google provider for ai-sdk
