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
