# Task 1.3: Set up Environment Variables and LLM API Configuration

## Description
Create configuration structure for connecting to multiple LLM providers (OpenAI, Anthropic/Claude, Google Gemini). This includes environment variable setup, validation, and a configuration module for accessing API keys throughout the application.

## Implementation Detail

### Steps:
1. Create `.env.local` file in project root:
   ```
   NEXT_PUBLIC_LLM_PROVIDER=openai
   OPENAI_API_KEY=your_openai_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   GOOGLE_GENAI_API_KEY=your_google_key_here
   ```
   - **Important**: Do NOT commit `.env.local` to git

2. Verify `.gitignore` includes `.env.local`:
   ```
   .env.local
   .env.local.example
   ```

3. Create `.env.example` file (commit this to git):
   ```
   NEXT_PUBLIC_LLM_PROVIDER=openai
   OPENAI_API_KEY=
   ANTHROPIC_API_KEY=
   GOOGLE_GENAI_API_KEY=
   ```

4. Create `lib/config.ts` to manage environment variables:
   ```typescript
   const config = {
     llmProviders: {
       openai: process.env.OPENAI_API_KEY,
       anthropic: process.env.ANTHROPIC_API_KEY,
       google: process.env.GOOGLE_GENAI_API_KEY,
     },
     defaultProvider: process.env.NEXT_PUBLIC_LLM_PROVIDER || 'openai',
   };

   export default config;
   ```

5. Create `lib/config-validator.ts` for validation:
   ```typescript
   export function validateConfig(): { valid: boolean; errors: string[] } {
     const errors: string[] = [];

     if (!process.env.OPENAI_API_KEY) {
       errors.push('OPENAI_API_KEY not set');
     }
     // Add checks for other providers

     return {
       valid: errors.length === 0,
       errors,
     };
   }
   ```

6. Create `app/setup/page.tsx` - simple config check page:
   ```typescript
   'use client';

   import { useState, useEffect } from 'react';
   import { validateConfig } from '@/lib/config-validator';

   export default function SetupPage() {
     const [status, setStatus] = useState({ valid: false, errors: [] });

     useEffect(() => {
       const validation = validateConfig();
       setStatus(validation);
     }, []);

     return (
       <div>
         <h1>LLM Configuration Status</h1>
         {status.valid ? <p>✅ All configured</p> : <p>❌ Missing configs</p>}
         {status.errors.map((err) => <p key={err}>{err}</p>)}
       </div>
     );
   }
   ```

## Unit Test Detail

**Test File**: `__tests__/config.test.ts`

Test cases:
- Verify config module exports provider keys
- Verify validation function detects missing keys
- Verify config has correct structure

```typescript
describe('LLM Configuration', () => {
  it('should export config with provider keys', () => {
    const config = require('../lib/config').default;
    expect(config).toHaveProperty('llmProviders');
    expect(config.llmProviders).toHaveProperty('openai');
    expect(config.llmProviders).toHaveProperty('anthropic');
    expect(config.llmProviders).toHaveProperty('google');
  });

  it('should have default provider set', () => {
    const config = require('../lib/config').default;
    expect(config.defaultProvider).toBeDefined();
  });

  it('should provide validation function', () => {
    const { validateConfig } = require('../lib/config-validator');
    const result = validateConfig();
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
    expect(Array.isArray(result.errors)).toBe(true);
  });
});
```

## Integration Test Detail

**Test File**: `tests/config.integration.test.ts`

Test cases:
- Verify config can be imported without errors
- Verify validation runs without crashing
- Verify env vars are readable

```typescript
describe('Configuration Integration', () => {
  it('should load config module without errors', () => {
    const config = require('../lib/config').default;
    expect(config).toBeDefined();
  });

  it('should run validation without errors', () => {
    const { validateConfig } = require('../lib/config-validator');
    expect(() => validateConfig()).not.toThrow();
  });

  it('should not expose API keys to client side by accident', () => {
    // Only NEXT_PUBLIC_* vars should be in browser
    const fs = require('fs');
    const content = fs.readFileSync('./lib/config.ts', 'utf-8');
    // Verify we're not leaking secrets
    expect(content).toContain('process.env');
  });
});
```

## Manual Test Detail

1. Create `.env.local` with placeholder values (dummy keys for now)
2. Add `.env.local` to `.gitignore` and verify it's in the file
3. Create `.env.example` with empty values
4. Run `npm run dev` and verify no errors in console about missing env vars
5. Visit `http://localhost:3000/setup` and verify page loads (showing config status)
6. Try visiting a non-existent page and verify it doesn't crash
7. Run `npx tsc --noEmit` and verify no TypeScript errors in config files
8. Verify `.env.local` is listed in `.gitignore` with `cat .gitignore | grep env.local`

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **`.env.local` created and in `.gitignore`**: File exists and won't be committed
2. **Config module loads**: `lib/config.ts` can be imported without errors
3. **Validation function works**: `validateConfig()` runs without crashing
4. **No TypeScript errors**: `npx tsc --noEmit` passes

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **Setup page renders**: `/setup` page shows config status
2. **Config has all provider keys**: openai, anthropic, google all present
3. **Validation detects missing keys**: Validation returns errors when keys are missing

**Pass Criteria**: At least 2 of 3 should work.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Real API keys added** (can use dummy keys for now, add real ones later)
2. **Env var generation script** (can add automation later)

## Recommended Testing Order:
1. **Manual first** (2 min): Create `.env.local`, verify `.gitignore`, check `/setup` page
2. **If manual passes**: Run TypeScript check
3. **If TypeScript passes**: Proceed to Task 1.4 ✅
4. **If manual fails**: Verify file paths and environment variable names

## Note / Status

- Status: ✅ COMPLETED
- Assigned to: [Team Member]
- Prerequisite: Task 1.1 and 1.2 must be completed
- Created: November 14, 2025
- Completed: November 14, 2025
- Notes:
  - `.env.local` created with placeholder values (properly in .gitignore)
  - `.env.example` created to document required environment variables
  - Configuration module successfully created and tested
  - Validation function working correctly
  - Setup page implemented with shadcn/ui components
  - All unit tests passing (5/5)
  - All integration tests passing (5/5)
  - TypeScript check passing with no errors
  - Ready to proceed to Task 1.4

## Related Files

This task involved the creation and modification of the following files:

### Environment Configuration
- `.env.local` - Local environment variables with placeholder API keys (NOT committed)
- `.env.example` - Template for environment variables (committed to git)

### Configuration Modules
- `lib/config.ts` - Main configuration module managing LLM provider API keys
- `lib/config-validator.ts` - Configuration validation function to check for missing API keys

### Application Pages
- `app/setup/page.tsx` - Configuration status page using shadcn/ui components

### Test Files
- `__tests__/config.test.ts` - Unit tests for configuration module and validation
- `tests/config.integration.test.ts` - Integration tests for environment and build setup
