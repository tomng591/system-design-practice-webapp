# Task 1.2: Install and Configure shadcn/ui

## Description
Set up the shadcn/ui component library to provide pre-built, accessible UI components with Tailwind styling. This enables rapid development with consistent, well-tested components.

## Implementation Detail

### Steps:
1. Install shadcn/ui CLI and dependencies:
   ```bash
   npm install -D shadcn-ui
   npm install class-variance-authority clsx tailwind-merge
   ```

2. Initialize shadcn/ui in the project:
   ```bash
   npx shadcn-ui@latest init
   ```
   - Choose light theme (or default)
   - Use default styling
   - Use CSS variables for colors (default)

3. Verify shadcn/ui setup:
   - Check `components/ui/` directory is created
   - Verify `lib/utils.ts` exists (contains `cn()` utility)

4. Add initial shadcn components:
   ```bash
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add input
   npx shadcn-ui@latest add card
   ```

5. Update `app/globals.css`:
   - Ensure Tailwind directives are present
   - Verify CSS variable setup for theme colors

6. Test component import in `app/page.tsx`:
   ```typescript
   import { Button } from '@/components/ui/button';
   import { Card } from '@/components/ui/card';
   import { Input } from '@/components/ui/input';
   ```

## Unit Test Detail

**Test File**: `__tests__/shadcn-setup.test.ts`

Test cases:
- Verify shadcn components are installed
- Verify Button, Input, Card components exist
- Verify utility function `cn()` works correctly

```typescript
describe('shadcn/ui Setup', () => {
  it('should have Button component installed', () => {
    const fs = require('fs');
    const buttonPath = './components/ui/button.tsx';
    expect(fs.existsSync(buttonPath)).toBe(true);
  });

  it('should have Input component installed', () => {
    const fs = require('fs');
    const inputPath = './components/ui/input.tsx';
    expect(fs.existsSync(inputPath)).toBe(true);
  });

  it('should have Card component installed', () => {
    const fs = require('fs');
    const cardPath = './components/ui/card.tsx';
    expect(fs.existsSync(cardPath)).toBe(true);
  });

  it('should have utils.ts with cn() utility', () => {
    const fs = require('fs');
    const utilsPath = './lib/utils.ts';
    const content = fs.readFileSync(utilsPath, 'utf-8');
    expect(content).toContain('cn');
    expect(content).toContain('clsx');
    expect(content).toContain('tailwind-merge');
  });
});
```

## Integration Test Detail

**Test File**: `tests/shadcn-components.integration.test.ts`

Test cases:
- Build should succeed with shadcn components
- Verify no TypeScript errors with component imports
- Components render without errors

```typescript
describe('shadcn/ui Components Integration', () => {
  it('should build successfully with shadcn components', async () => {
    const { execSync } = require('child_process');
    const output = execSync('npm run build 2>&1', { encoding: 'utf-8' });
    expect(output).toContain('compiled');
    expect(output).not.toContain('error');
  });

  it('TypeScript should not report errors in component imports', () => {
    const { execSync } = require('child_process');
    const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8' });
    expect(output).not.toContain('error TS');
  });
});
```

## Manual Test Detail

1. After running Task 1.1, start dev server: `npm run dev`
2. Open `http://localhost:3000` in browser
3. Manually verify shadcn components are styled correctly:
   - Look for Button component styling (verify Tailwind classes apply)
   - Check that components have proper spacing and colors
4. In dev tools, inspect Button element and verify Tailwind classes are present
5. Run `npx tsc --noEmit` and verify no TypeScript errors from component imports
6. Run `npm run build` and verify build succeeds
7. Verify `components/ui/` contains at least 3 files: `button.tsx`, `input.tsx`, `card.tsx`

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **shadcn/ui components exist**: Files in `components/ui/` for Button, Input, Card
2. **No TypeScript errors**: `npx tsc --noEmit` passes with component imports
3. **Build succeeds**: `npm run build` completes without errors
4. **Components render**: Browser shows no console errors when loading page

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **Tailwind styling applies**: Components visually look styled (not unstyled)
2. **Component library works**: Can import Button, Input, Card without errors
3. **CSS variables set**: Theme colors defined in globals.css

**Pass Criteria**: At least 2 of 3 should work. If all fail, re-run shadcn init.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Additional components added** (can add more later as needed)
2. **Theme customization** (can customize colors/spacing later)

## Recommended Testing Order:
1. **Manual first** (2 min): Run `npm run build`, open browser, inspect elements
2. **If visual looks good**: Run TypeScript check
3. **If TypeScript passes**: Proceed to Task 1.3 ✅
4. **If manual fails**: Verify shadcn init completed, check globals.css

## Note / Status

- Status: ✅ COMPLETED
- Assigned to: [Team Member]
- Prerequisite: Task 1.1 must be completed
- Created: November 14, 2025
- Completed: November 14, 2025
- Notes:
  - Successfully installed shadcn/ui with the new 'shadcn' package (shadcn-ui deprecated)
  - Initialized with New York style and Neutral base color
  - All 3 components (Button, Input, Card) installed
  - CSS variables configured in app/globals.css
  - Components tested in app/page.tsx
  - All unit tests passing (4/4)
  - All integration tests passing
  - Build completed successfully
  - Ready to proceed to Task 1.3

## Related Files

This task involved the creation and modification of the following files:

### Configuration Files
- `components.json` - shadcn/ui configuration file
- `tailwind.config.ts` - Updated with shadcn/ui preset
- `package.json` - Added shadcn and related dependencies
- `package-lock.json` - Dependency lock file

### Utility Files
- `lib/utils.ts` - Utility function with `cn()` for class merging

### Component Files (UI Library)
- `components/ui/button.tsx` - Button component from shadcn/ui
- `components/ui/input.tsx` - Input component from shadcn/ui
- `components/ui/card.tsx` - Card component from shadcn/ui

### Global Styles
- `app/globals.css` - Updated with CSS variables and Tailwind directives

### Application
- `app/page.tsx` - Updated to import and test shadcn components

### Test Files
- `__tests__/shadcn-setup.test.ts` - Unit tests for shadcn setup verification
- `tests/shadcn-components.integration.test.ts` - Integration tests for build and TypeScript
