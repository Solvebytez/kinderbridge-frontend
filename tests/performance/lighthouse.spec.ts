import { test, expect } from '@playwright/test'
import lighthouse from 'lighthouse'
import { writeFileSync } from 'fs'
import { join } from 'path'

test.describe('Performance Testing', () => {
  test('should meet Lighthouse performance standards', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
    
    // Run Lighthouse audit
    const { lhr } = await lighthouse(page.url(), {
      port: (new URL(page.url())).port || '80',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    })
    
    // Performance assertions
    expect(lhr.categories.performance.score).toBeGreaterThanOrEqual(0.9)
    expect(lhr.categories.accessibility.score).toBeGreaterThanOrEqual(0.9)
    expect(lhr.categories['best-practices'].score).toBeGreaterThanOrEqual(0.9)
    expect(lhr.categories.seo.score).toBeGreaterThanOrEqual(0.9)
    
    // Save detailed report
    const reportPath = join(process.cwd(), 'lighthouse-report.json')
    writeFileSync(reportPath, JSON.stringify(lhr, null, 2))
    
    console.log('Lighthouse Report saved to:', reportPath)
    console.log('Performance Score:', lhr.categories.performance.score)
    console.log('Accessibility Score:', lhr.categories.accessibility.score)
    console.log('Best Practices Score:', lhr.categories['best-practices'].score)
    console.log('SEO Score:', lhr.categories.seo.score)
  })

  test('should load homepage within 3 seconds', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000)
    
    console.log(`Homepage loaded in ${loadTime}ms`)
  })

  test('should have good Core Web Vitals', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')
    
    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
    
    // LCP should be under 2.5 seconds
    expect(lcp).toBeLessThan(2500)
    
    // Measure First Input Delay (FID)
    const fid = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const firstEntry = entries[0]
          resolve(firstEntry.processingStart - firstEntry.startTime)
        }).observe({ entryTypes: ['first-input'] })
      })
    })
    
    // FID should be under 100ms
    expect(fid).toBeLessThan(100)
    
    console.log(`LCP: ${lcp}ms, FID: ${fid}ms`)
  })

  test('should handle search efficiently', async ({ page }) => {
    await page.goto('/search')
    await page.waitForLoadState('networkidle')
    
    const startTime = Date.now()
    
    // Perform search
    await page.getByPlaceholder('What are you looking for?').fill('day care')
    await page.getByPlaceholder('Enter your location').fill('Whitby')
    await page.getByRole('button', { name: /Search Daycares/ }).click()
    
    // Wait for results
    await page.waitForSelector('[data-testid="daycare-card"]', { timeout: 5000 })
    
    const searchTime = Date.now() - startTime
    expect(searchTime).toBeLessThan(2000)
    
    console.log(`Search completed in ${searchTime}ms`)
  })
})
