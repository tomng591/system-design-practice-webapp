# Task 1.1: Initialize Next.js + React + TypeScript + TailwindCSS Project

## Description
Set up the foundational project structure with Next.js, React, TypeScript, and TailwindCSS. This establishes the base for all future development with proper tooling, configuration, and development environment.

## Implementation Detail

### Steps:
1. Create project using create-next-app:
   ```bash
   npx create-next-app@latest system-design-practice-webapp \
     --typescript \
     --tailwind \
     --app \
     --no-eslint \
     --no-git
   ```

2. Verify project structure:
   - `app/` - Next.js app directory
   - `components/` - React components
   - `lib/` - utility functions and libraries
   - `public/` - static assets
   - `node_modules/` - dependencies
   - `tsconfig.json` - TypeScript configuration
   - `next.config.ts` - Next.js configuration
   - `tailwind.config.ts` - Tailwind configuration

3. Install additional dependencies:
   ```bash
   npm install
   ```

4. Configure TypeScript (`tsconfig.json`):
   - Verify `strict: true` is set
   - Verify `target: "ES2020"` and `lib: ["ES2020", "DOM", "DOM.Iterable"]`
   - Add path aliases:
     ```json
     "paths": {
       "@/*": ["./*"]
     }
     ```

5. Update Tailwind config (`tailwind.config.ts`):
   - Set content paths for `app/` and `components/` directories
   - Configure theme if needed

6. Create `.gitignore` entries:
   - Ensure `.env.local` is ignored
   - Ensure `node_modules/` is ignored
   - Ensure `.next/` is ignored

7. Set up npm scripts in `package.json`:
   - `npm run dev` - start dev server
   - `npm run build` - production build
   - `npm run start` - start production server

## Unit Test Detail

**Test File**: `__tests__/setup.test.ts`

Test cases:
- Verify TypeScript configuration is valid
- Verify package.json has required dependencies
- Verify tsconfig.json has correct compiler options

```typescript
describe('Project Setup - TypeScript & Dependencies', () => {
  it('should have React and Next.js installed', () => {
    const pkg = require('../package.json');
    expect(pkg.dependencies).toHaveProperty('react');
    expect(pkg.dependencies).toHaveProperty('next');
    expect(pkg.devDependencies).toHaveProperty('typescript');
  });

  it('should have TailwindCSS installed', () => {
    const pkg = require('../package.json');
    expect(pkg.devDependencies).toHaveProperty('tailwindcss');
  });

  it('tsconfig.json should have strict mode enabled', () => {
    const tsconfig = require('../tsconfig.json');
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  it('tsconfig.json should have correct target', () => {
    const tsconfig = require('../tsconfig.json');
    expect(tsconfig.compilerOptions.target).toMatch(/ES2020|ES2024/);
  });
});
```

## Integration Test Detail

**Test File**: `tests/build.integration.test.ts`

Test cases:
- Run Next.js build and verify success
- Verify no TypeScript compilation errors
- Verify .next build output is created

```typescript
describe('Build Integration', () => {
  it('should build without TypeScript errors', async () => {
    const { execSync } = require('child_process');
    const output = execSync('npx tsc --noEmit', { encoding: 'utf-8' });
    expect(output).not.toContain('error');
  });

  it('should run npm build successfully', async () => {
    const { execSync } = require('child_process');
    const output = execSync('npm run build 2>&1', { encoding: 'utf-8' });
    expect(output).toContain('compiled');
  });
});
```

## Manual Test Detail

1. Run `npm install` and verify all dependencies install without errors
2. Run `npm run dev` and verify development server starts on http://localhost:3000
3. Open browser to `http://localhost:3000` and verify default Next.js page loads
4. Run `npx tsc --noEmit` and verify no TypeScript errors
5. Run `npm run build` and verify `.next/` folder is created successfully
6. Verify `.gitignore` file includes:
   - `node_modules/`
   - `.next/`
   - `.env.local`
   - `dist/`

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers - Task cannot be completed without these)
1. **npm install succeeds**: No installation errors, all dependencies installed
2. **npm run dev starts**: Development server starts without errors on port 3000
3. **TypeScript compilation passes**: `npx tsc --noEmit` returns exit code 0
4. **npm run build succeeds**: `.next/` folder created without build errors

**Pass Criteria**: All 4 above criteria must be met. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **TailwindCSS works**: Tailwind styles apply correctly to page
2. **Default page loads in browser**: Can access http://localhost:3000 successfully
3. **Path aliases work**: Can import using `@/` prefix

**Pass Criteria**: At least 2 of 3 should work. If all fail, review Tailwind or Next.js config.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **ESLint setup** (already skipped in create-next-app, can add later)
2. **Production build optimization** (can fine-tune later)

## Recommended Testing Order:
1. **Manual first** (3 min): Run npm install, start dev server, open browser
2. **If manual passes**: Proceed to Task 1.2 ✅
3. **If manual fails**: Check Node.js version, npm version, debug errors
4. **Unit tests**: Run after confirming build succeeds

## Note / Status

- Status: ⏳ PENDING
- Assigned to: [Team Member]
- Created: November 14, 2025
- Notes:
  - This is the first foundational task
  - Make sure Node.js >= 18 is installed before starting
  - If using nvm, verify correct Node version: `nvm use 18`
  - Ready to proceed to Task 1.2 once all MUST-PASS criteria are met
