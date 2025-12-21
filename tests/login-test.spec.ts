import { test, expect } from '@playwright/test';

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3000/login');
  });

  test('should login successfully with testlogin@test.com', async ({ page }) => {
    // Fill in the login form
    await page.fill('input[name="email"]', 'testlogin@test.com');
    await page.fill('input[name="password"]', 'test123');
    
    // Click the login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard');
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify user is logged in by checking for user info in navigation
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[name="email"]', 'invalid@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Click the login button
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should login with ashwaq+5@ashvak.com and test different passwords', async ({ page }) => {
    const testPasswords = ['test123', 'Ash@123', 'password', 'ashwaq123', 'ashvak123', '123456'];
    
    for (const password of testPasswords) {
      console.log(`Testing password: ${password}`);
      
      // Fill in the login form
      await page.fill('input[name="email"]', 'ashwaq+5@ashvak.com');
      await page.fill('input[name="password"]', password);
      
      // Click the login button
      await page.click('button[type="submit"]');
      
      // Wait a moment for the request to complete
      await page.waitForTimeout(2000);
      
      // Check if we're redirected to dashboard (successful login)
      if (page.url().includes('dashboard')) {
        console.log(`✅ SUCCESS: Password '${password}' worked!`);
        await expect(page).toHaveURL(/.*dashboard/);
        await expect(page.locator('text=Ashvak Sheik')).toBeVisible();
        return; // Exit the test if login was successful
      }
      
      // If not redirected, check for error message
      const errorMessage = await page.locator('text=Invalid credentials').isVisible();
      if (errorMessage) {
        console.log(`❌ Password '${password}' failed - Invalid credentials`);
      }
      
      // Clear the form for next attempt
      await page.fill('input[name="email"]', '');
      await page.fill('input[name="password"]', '');
    }
    
    // If we get here, none of the passwords worked
    throw new Error('None of the test passwords worked for ashwaq+5@ashvak.com');
  });

  test('should preserve search parameters when redirecting to login from search page', async ({ page }) => {
    // First go to search page with parameters
    await page.goto('http://localhost:3000/search?location=Whitby&q=daycare');
    
    // Click on "Sign In" link (should preserve search parameters)
    await page.click('text=Sign In');
    
    // Verify we're on login page with return parameters
    await expect(page).toHaveURL(/.*login.*returnTo=search.*params=/);
    
    // Login
    await page.fill('input[name="email"]', 'testlogin@test.com');
    await page.fill('input[name="password"]', 'test123');
    await page.click('button[type="submit"]');
    
    // Should redirect back to search page with original parameters
    await page.waitForURL('**/search?location=Whitby&q=daycare');
    await expect(page).toHaveURL(/.*search.*location=Whitby.*q=daycare/);
  });
});
