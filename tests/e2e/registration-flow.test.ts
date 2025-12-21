import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');
  });

  test('should display registration form', async ({ page }) => {
    // Check if the form is visible
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
    await expect(page.getByLabel(/address/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /register/i }).click();
    
    // Check for validation errors
    await expect(page.getByText(/valid email is required/i)).toBeVisible();
    await expect(page.getByText(/password must be at least 6 characters long/i)).toBeVisible();
    await expect(page.getByText(/first name must be at least 2 characters long/i)).toBeVisible();
    await expect(page.getByText(/last name must be at least 2 characters long/i)).toBeVisible();
    await expect(page.getByText(/phone number is required/i)).toBeVisible();
    await expect(page.getByText(/address is required/i)).toBeVisible();
  });

  test('should validate password confirmation', async ({ page }) => {
    // Fill in form with mismatched passwords
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('different123');
    await page.getByLabel(/first name/i).fill('Test');
    await page.getByLabel(/last name/i).fill('User');
    await page.getByLabel(/phone/i).fill('1234567890');
    await page.getByLabel(/address/i).fill('123 Test St');
    
    // Add a child
    await page.getByLabel(/child name/i).first().fill('Test Child');
    await page.getByLabel(/age/i).first().fill('3');
    
    await page.getByRole('button', { name: /register/i }).click();
    
    // Check for password mismatch error
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    // Generate unique email
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    // Fill in the form
    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    await page.getByLabel(/first name/i).fill('Test');
    await page.getByLabel(/last name/i).fill('User');
    await page.getByLabel(/phone/i).fill('1234567890');
    await page.getByLabel(/address/i).fill('123 Test St');
    
    // Add a child
    await page.getByLabel(/child name/i).first().fill('Test Child');
    await page.getByLabel(/age/i).first().fill('3');
    
    // Submit the form
    await page.getByRole('button', { name: /register/i }).click();
    
    // Wait for successful registration and redirect
    await expect(page).toHaveURL(/.*success/);
    
    // Check for success message
    await expect(page.getByText(/registration successful/i)).toBeVisible();
  });

  test('should handle existing email error', async ({ page }) => {
    // Try to register with an existing email
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    await page.getByLabel(/first name/i).fill('Test');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    await page.getByLabel(/first name/i).fill('Test');
    await page.getByLabel(/last name/i).fill('User');
    await page.getByLabel(/phone/i).fill('1234567890');
    await page.getByLabel(/address/i).fill('123 Test St');
    
    // Add a child
    await page.getByLabel(/child name/i).first().fill('Test Child');
    await page.getByLabel(/age/i).first().fill('3');
    
    // Submit the form
    await page.getByRole('button', { name: /register/i }).click();
    
    // Check for existing email error
    await expect(page.getByText(/user with this email already exists/i)).toBeVisible();
  });
});
