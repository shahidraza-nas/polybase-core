import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { copyTemplate } from './index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('copyTemplate', () => {
  const testDir = path.join(__dirname, '../../../test-output');
  const srcDir = path.join(testDir, 'source');
  const destDir = path.join(testDir, 'destination');

  beforeEach(async () => {
    await fs.ensureDir(srcDir);
    await fs.writeFile(path.join(srcDir, 'test.txt'), 'test content');
    await fs.ensureDir(path.join(srcDir, 'subdir'));
    await fs.writeFile(path.join(srcDir, 'subdir', 'nested.txt'), 'nested content');
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  it('should copy directory recursively', async () => {
    await copyTemplate(srcDir, destDir);

    expect(await fs.pathExists(destDir)).toBe(true);
    expect(await fs.pathExists(path.join(destDir, 'test.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(destDir, 'subdir', 'nested.txt'))).toBe(true);

    const content = await fs.readFile(path.join(destDir, 'test.txt'), 'utf-8');
    expect(content).toBe('test content');
  });

  it('should not overwrite existing files', async () => {
    await fs.ensureDir(destDir);
    await fs.writeFile(path.join(destDir, 'test.txt'), 'existing content');

    await copyTemplate(srcDir, destDir);

    const content = await fs.readFile(path.join(destDir, 'test.txt'), 'utf-8');
    expect(content).toBe('existing content');
  });

  it('should throw error when source does not exist', async () => {
    const nonExistentSrc = path.join(testDir, 'nonexistent');

    await expect(copyTemplate(nonExistentSrc, destDir)).rejects.toThrow();
  });
});
