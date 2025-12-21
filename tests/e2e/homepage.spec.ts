import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display main sections', async ({ page }) => {
    // Check hero section
    await expect(page.getByRole('heading', { name: /Find the Perfect Daycare/ })).toBeVisible()
    await expect(page.getByText(/Connect with verified daycare centers/)).toBeVisible()
    
    // Check search form
    await expect(page.getByPlaceholder('What are you looking for?')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your location')).toBeVisible()
    await expect(page.getByRole('button', { name: /Search Daycares/ })).toBeVisible()
  })

  test('should have working search functionality', async ({ page }) => {
    // Fill search form
    await page.getByPlaceholder('What are you looking for?').fill('day care')
    await page.getByPlaceholder('Enter your location').fill('Whitby')
    
    // Submit search
    await page.getByRole('button', { name: /Search Daycares/ }).click()
    
    // Should navigate to search page
    await expect(page).toHaveURL(/\/search/)
  })

  test('should display location dropdown', async ({ page }) => {
    const locationInput = page.getByPlaceholder('Enter your location')
    await locationInput.click()
    
    // Check if dropdown appears with GTA cities
    await expect(page.getByText('Toronto')).toBeVisible()
    await expect(page.getByText('Whitby')).toBeVisible()
    await expect(page.getByText('Oshawa')).toBeVisible()
  })

  test('should show stats section', async ({ page }) => {
    await expect(page.getByText('500+')).toBeVisible()
    await expect(page.getByText('Daycare Centers')).toBeVisible()
    await expect(page.getByText('10K+')).toBeVisible()
    await expect(page.getByText('Happy Parents')).toBeVisible()
  })

  test('should display features section', async ({ page }) => {
    await expect(page.getByText('Smart Search')).toBeVisible()
    await expect(page.getByText('Verified Centers')).toBeVisible()
    await expect(page.getByText('Parent Reviews')).toBeVisible()
    await expect(page.getByText('Direct Contact')).toBeVisible()
  })

  test('should show how it works section', async ({ page }) => {
    await expect(page.getByText('Search')).toBeVisible()
    await expect(page.getByText('Compare')).toBeVisible()
    await expect(page.getByText('Contact')).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    // Check navigation links
    await expect(page.getByRole('link', { name: /Find Daycare/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /About/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Sign In/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Get Started/ })).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if mobile navigation is accessible
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
    
    // Check if content is properly sized
    const heroHeading = page.getByRole('heading', { name: /Find the Perfect Daycare/ })
    await expect(heroHeading).toBeVisible()
  })

  test('should have working video modal', async ({ page }) => {
    // Click watch demo button
    await page.getByRole('button', { name: /Watch Demo/ }).click()
    
    // Check if modal opens
    await expect(page.getByText('DayCare Concierge Demo')).toBeVisible()
    await expect(page.getByRole('button', { name: /close/i })).toBeVisible()
    
    // Close modal
    await page.getByRole('button', { name: /close/i }).click()
    
    // Check if modal closes
    await expect(page.getByText('DayCare Concierge Demo')).not.toBeVisible()
  })
})
