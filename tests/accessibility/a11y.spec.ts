import { test, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

test.describe('Accessibility Testing', () => {
  test('homepage should meet WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
    
    console.log('Accessibility violations found:', accessibilityScanResults.violations.length)
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Violations:', JSON.stringify(accessibilityScanResults.violations, null, 2))
    }
  })

  test('search page should be accessible', async ({ page }) => {
    await page.goto('/search')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Check for main heading (h1)
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    
    // Check heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingTexts = await headings.allTextContents()
    
    console.log('Heading structure:', headingTexts)
    
    // Should have logical heading hierarchy
    expect(headingTexts.length).toBeGreaterThan(3)
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/')
    
    // Check search form accessibility
    const searchInput = page.getByPlaceholder('What are you looking for?')
    const locationInput = page.getByPlaceholder('Enter your location')
    
    // Inputs should have associated labels or aria-labels
    await expect(searchInput).toBeVisible()
    await expect(locationInput).toBeVisible()
    
    // Check if inputs are properly labeled
    const searchLabel = page.locator('label[for="search-input"]')
    const locationLabel = page.locator('label[for="location-input"]')
    
    // Either visible labels or aria-labels should be present
    if (await searchLabel.count() === 0) {
      await expect(searchInput).toHaveAttribute('aria-label')
    }
    if (await locationLabel.count() === 0) {
      await expect(locationInput).toHaveAttribute('aria-label')
    }
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')
    
    // Check if text has sufficient contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze()
    
    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    )
    
    expect(contrastViolations).toEqual([])
    
    if (contrastViolations.length > 0) {
      console.log('Color contrast violations:', contrastViolations)
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    
    // Should focus on first interactive element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Test arrow key navigation for dropdowns
    const locationInput = page.getByPlaceholder('Enter your location')
    await locationInput.click()
    
    // Should show dropdown
    await expect(page.getByText('Toronto')).toBeVisible()
    
    // Test keyboard navigation in dropdown
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    
    // Should select first option
    await expect(locationInput).toHaveValue('Toronto')
  })

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper ARIA attributes
    const searchButton = page.getByRole('button', { name: /Search Daycares/ })
    await expect(searchButton).toHaveAttribute('type', 'submit')
    
    // Check if modal has proper ARIA attributes
    const watchDemoButton = page.getByRole('button', { name: /Watch Demo/ })
    await watchDemoButton.click()
    
    // Modal should have proper ARIA attributes
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()
    await expect(modal).toHaveAttribute('aria-modal', 'true')
    
    // Close modal
    const closeButton = page.getByRole('button', { name: /close/i })
    await closeButton.click()
  })

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/')
    
    // Check all images have alt text
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i)
      const altText = await image.getAttribute('alt')
      
      // Alt text should be present and meaningful
      expect(altText).toBeTruthy()
      expect(altText).not.toBe('')
      expect(altText).not.toBe('image')
    }
  })

  test('should have skip links for screen readers', async ({ page }) => {
    await page.goto('/')
    
    // Check for skip to main content link
    const skipLink = page.locator('a[href="#main-content"]')
    
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible()
      await expect(skipLink).toHaveText(/skip to main content/i)
    }
  })

  test('should handle screen reader announcements', async ({ page }) => {
    await page.goto('/')
    
    // Check for live regions
    const liveRegions = page.locator('[aria-live]')
    const liveRegionCount = await liveRegions.count()
    
    if (liveRegionCount > 0) {
      // Live regions should have appropriate values
      for (let i = 0; i < liveRegionCount; i++) {
        const region = liveRegions.nth(i)
        const ariaLive = await region.getAttribute('aria-live')
        expect(['polite', 'assertive', 'off']).toContain(ariaLive)
      }
    }
  })
})
