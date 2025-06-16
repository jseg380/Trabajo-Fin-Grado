import { test, expect } from '@playwright/test';

// A single describe block for all tests
test.describe('Full Vehicle CRUD Flow', () => {

  // This hook runs before EACH test in this file.
  // It guarantees a clean database and a fresh login every time.
  test.beforeEach(async ({ page, request }) => {
    // 1. Reset the database to a known state.
    await request.post('http://localhost:5000/api/init-db');
    
    // 2. Perform the login on the 'page' object for this specific test.
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('testPassword');
    await page.getByRole('button', { name: 'Login' }).click();

    // 3. Wait for the main page to load before proceeding with the test body.
    await expect(page.getByText('Maintenance Alerts')).toBeVisible();
  });

  // Read
  test('should display existing vehicles on load', async ({ page }) => {
    // The user is already logged in and on the home page.
    // We just need to navigate to the vehicles page.
    await page.goto('/vehicles');
    
    // Verify the seeded vehicle is visible.
    await expect(page.getByText('Ford Focus')).toBeVisible();
  });

  // Create
  test('should allow a user to create a new vehicle', async ({ page }) => {
    // Start on the vehicles page
    await page.goto('/vehicles');

    // Click the FAB to add a new vehicle
    await page.getByRole('button', { name: 'Add' }).click();
    await page.waitForURL('**/vehicles/add');

    // Fill out the form
    await page.getByPlaceholder('Make').fill('Mazda');
    await page.getByPlaceholder('Model').fill('MX-5');
    await page.getByPlaceholder('Year').fill('2024');
    await page.getByRole('button', { name: 'Select a Fuel Type' }).click();
    await page.getByRole('menuitem', { name: 'Gasoline' }).click();
    await page.getByRole('button', { name: 'Fetch Technical Specs' }).click();

    // This listener will automatically accept any 'alert' dialog that appears.
    page.on('dialog', async dialog => {
      // Assert the dialog's message to make the test more robust.
      expect(dialog.message()).toContain('Vehicle added successfully');
      await dialog.accept();
    });

    // Add and verify
    await page.getByRole('button', { name: 'Add Vehicle to My Garage' }).click();
    await page.goto('/vehicles');
    await expect(page.getByText('Mazda MX-5')).toBeVisible();
  });

  // Update
  test('should allow a user to edit a vehicle', async ({ page }) => {
    // Start on the vehicles page
    await page.goto('/vehicles');

    // Find the vehicle to delete
    const vehicleCard = page.getByText('Ford Focus').locator('..').locator('..');
    
    // Set up a listener for the confirmation dialog *before* clicking
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Vehicle updated');
      await dialog.accept();
    });

    // Click the delete button
    await vehicleCard.getByLabel('Edit').click();

    // Modify the car information
    await page.getByPlaceholder('Make').fill('Ford 2');
    await page.getByPlaceholder('Model').fill('Focus RS');
    await page.getByPlaceholder('Year').fill('2023');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Verify the vehicle is gone
    await page.goto('/vehicles');
    await expect(page.getByText('Ford 2 Focus RS')).toBeVisible();
  });

  // Delete
  test('should allow a user to delete a vehicle', async ({ page }) => {
    // Start on the vehicles page
    await page.goto('/vehicles');

    // Find the vehicle to delete
    const vehicleCard = page.getByText('Ford Focus').locator('..').locator('..');
    
    // Set up a listener for the confirmation dialog *before* clicking
    page.on('dialog', async dialog => {
      const message = await dialog.message();
      expect(
        message.includes('Are you sure you want to delete the') ||
        message.includes('Vehicle deleted')
      ).toBe(true);
      await dialog.accept();
    });

    // Click the delete button
    await vehicleCard.getByLabel('Delete').click();
    
    // Verify the vehicle is gone
    await page.goto('/vehicles');
    await expect(page.getByText('Ford Focus')).not.toBeVisible();
  });
});
