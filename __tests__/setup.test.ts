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

  it('tsconfig.json should have path aliases configured', () => {
    const tsconfig = require('../tsconfig.json');
    expect(tsconfig.compilerOptions.paths).toBeDefined();
    expect(tsconfig.compilerOptions.paths['@/*']).toBeDefined();
  });

  it('package.json should have required scripts', () => {
    const pkg = require('../package.json');
    expect(pkg.scripts).toHaveProperty('dev');
    expect(pkg.scripts).toHaveProperty('build');
    expect(pkg.scripts).toHaveProperty('start');
  });
});
