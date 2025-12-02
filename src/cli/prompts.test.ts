import { describe, it, expect } from 'vitest';
import { initPrompts } from './index.js';

describe('initPrompts', () => {
  it('should export initPrompts function', () => {
    expect(initPrompts).toBeDefined();
    expect(typeof initPrompts).toBe('function');
  });

  // Note: Testing interactive prompts requires mocking inquirer
  // These are integration tests and should be tested manually or with e2e tests
  // For now, we just ensure the function exists and has the right signature
});
