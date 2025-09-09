import { defineConfig } from '@playwright/test';

const headlessEnv = process.env.PLAYWRIGHT_HEADLESS;
// By default run headless (CI). Set PLAYWRIGHT_HEADLESS=false to run headed locally.
const headless = headlessEnv === undefined ? true : headlessEnv !== 'false';

export default defineConfig({
  testDir: './',
  timeout: 30_000,
  expect: {
    timeout: 5000
  },
  use: {
    headless,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  }
});
