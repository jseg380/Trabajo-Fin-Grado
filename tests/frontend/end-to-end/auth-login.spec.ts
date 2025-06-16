import { test, expect } from '@playwright/test';

test.describe('Full Authentication Flow', () => {

  // Before each test, we need a clean user in the database.
  // We can do this by calling our own backend's init-db endpoint.
  test.beforeEach(async ({ request }) => {
    // This makes an API request from Playwright itself to reset the test data.
    // This assumes the main backend is running.
    await request.post('http://localhost:5000/api/init-db');
  });

  test('should allow a user to log in and be redirected to the home/maintenance page', async ({ page }) => {
    // Step 1: Navigate to the app and verify redirection to login
    await page.goto('/');
    await page.waitForURL('**/login');
    await expect(page.getByText('Sign in', { exact: true })).toBeVisible();

    // Step 2: Fill in the login form with the seeded user's credentials
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('testPassword');

    // Step 3: Click the login button
    // We use getByRole for better accessibility and robustness
    await page.getByRole('button', { name: 'Login' }).click();

    // Step 4: Verify successful redirection to the main app (home tab)
    // We wait for the URL to contain '/home' which is the first tab.
    await page.waitForURL('**/home');

    // Step 5: Verify that we are on the home/maintenance page by checking for its content
    await expect(page.getByText('Maintenance Alerts')).toBeVisible();
  });
});
