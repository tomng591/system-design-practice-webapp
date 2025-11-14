describe('Build Integration', () => {
  it('should build without TypeScript errors', () => {
    const { execSync } = require('child_process');
    const output = execSync('npx tsc --noEmit', { encoding: 'utf-8' });
    expect(output).not.toContain('error');
  });

  it('should have .next folder created from previous build', () => {
    const path = require('path');
    const fs = require('fs');
    const nextBuildPath = path.join(__dirname, '..', '.next');
    expect(fs.existsSync(nextBuildPath)).toBe(true);
  });

  it('should have build manifest files in .next folder', () => {
    const path = require('path');
    const fs = require('fs');
    const nextPath = path.join(__dirname, '..', '.next');
    const requiredFiles = [
      'build-manifest.json',
      'app-build-manifest.json',
      'routes-manifest.json',
    ];

    requiredFiles.forEach((file) => {
      const filePath = path.join(nextPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it('should have proper directory structure', () => {
    const path = require('path');
    const fs = require('fs');
    const rootPath = path.join(__dirname, '..');
    const requiredDirs = [
      'app',
      'components',
      'lib',
      'public',
      'node_modules',
    ];

    requiredDirs.forEach((dir) => {
      const dirPath = path.join(rootPath, dir);
      expect(fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()).toBe(true);
    });
  });
});
