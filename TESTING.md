# 🧪 Testing Guide - DayCare Concierge MVP

## 📋 Overview

This document covers the comprehensive testing strategy for the DayCare Concierge application, including unit tests, end-to-end tests, performance testing, and accessibility testing.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install --legacy-peer-deps
npx playwright install
```

### Run All Tests
```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui

# Performance tests
npm run test:e2e --grep "Performance Testing"

# Accessibility tests
npm run test:e2e --grep "Accessibility Testing"
```

## 🧩 Testing Architecture

### 1. Unit Testing (Jest + React Testing Library)
- **Location**: `src/components/__tests__/`
- **Framework**: Jest + React Testing Library
- **Coverage**: Components, utilities, hooks
- **Configuration**: `jest.config.js`

### 2. End-to-End Testing (Playwright)
- **Location**: `tests/e2e/`
- **Framework**: Playwright
- **Coverage**: User workflows, cross-browser testing
- **Configuration**: `playwright.config.ts`

### 3. Performance Testing (Lighthouse)
- **Location**: `tests/performance/`
- **Framework**: Playwright + Lighthouse
- **Coverage**: Core Web Vitals, performance metrics
- **Targets**: < 3s load time, > 90 Lighthouse score

### 4. Accessibility Testing (Axe + Playwright)
- **Location**: `tests/accessibility/`
- **Framework**: Playwright + Axe-core
- **Coverage**: WCAG 2.1 AA compliance
- **Focus**: Color contrast, keyboard navigation, screen readers

## 📊 Test Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| **Lines** | 80% | TBD |
| **Functions** | 80% | TBD |
| **Branches** | 80% | TBD |
| **Statements** | 80% | TBD |

## 🎯 Test Categories

### Unit Tests
- **Component Rendering**: Verify components render correctly
- **User Interactions**: Test button clicks, form submissions
- **State Management**: Test component state changes
- **Props Validation**: Test component behavior with different props
- **Error Handling**: Test error states and edge cases

### Integration Tests
- **API Integration**: Test data fetching and state updates
- **Component Communication**: Test parent-child component interactions
- **Form Validation**: Test complete form workflows
- **Navigation**: Test routing between pages

### E2E Tests
- **User Journeys**: Complete user workflows
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: Responsive design validation
- **Real Data**: Test with actual daycare data

### Performance Tests
- **Page Load Times**: < 3 seconds
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms
- **Lighthouse Scores**: > 90 in all categories
- **Search Performance**: < 2 seconds for results

### Accessibility Tests
- **WCAG 2.1 AA**: Full compliance
- **Screen Reader**: NVDA, JAWS, VoiceOver
- **Keyboard Navigation**: Tab, arrow keys, Enter
- **Color Contrast**: 4.5:1 minimum ratio
- **ARIA Attributes**: Proper labeling and roles

## 🔧 Test Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

## 📝 Writing Tests

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VideoModal from '../VideoModal'

describe('VideoModal', () => {
  it('should render when open', () => {
    render(<VideoModal isOpen={true} onClose={jest.fn()} />)
    expect(screen.getByText('DayCare Concierge Demo')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnClose = jest.fn()
    render(<VideoModal isOpen={true} onClose={mockOnClose} />)
    
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test'

test('should search for daycares', async ({ page }) => {
  await page.goto('/search')
  
  await page.getByPlaceholder('What are you looking for?').fill('day care')
  await page.getByPlaceholder('Enter your location').fill('Whitby')
  await page.getByRole('button', { name: /Search Daycares/ }).click()
  
  await expect(page.getByText('Bright Beginnings Childcare')).toBeVisible()
})
```

## 🚨 Common Issues & Solutions

### 1. React Version Compatibility
```bash
# If you get React version conflicts
npm install --legacy-peer-deps
```

### 2. Playwright Installation
```bash
# Install Playwright browsers
npx playwright install

# Install specific browser
npx playwright install chromium
```

### 3. Test Environment Issues
```bash
# Clear Jest cache
npm run test -- --clearCache

# Reset Playwright
npx playwright install --force
```

## 📈 Continuous Integration

### GitHub Actions
- **Automatic Testing**: Runs on every push/PR
- **Coverage Reports**: Uploads to Codecov
- **E2E Testing**: Cross-browser testing
- **Performance Monitoring**: Lighthouse audits
- **Accessibility Checks**: WCAG compliance

### Pre-commit Hooks
```bash
# Install husky
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run test && npm run lint"
```

## 🔍 Debugging Tests

### Jest Debug Mode
```bash
# Run tests in debug mode
npm run test -- --verbose --detectOpenHandles

# Debug specific test
npm run test -- --testNamePattern="VideoModal"
```

### Playwright Debug Mode
```bash
# Run with UI
npm run test:e2e:ui

# Debug specific test
npx playwright test --debug homepage.spec.ts
```

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# Open coverage in browser
open coverage/lcov-report/index.html
```

## 📚 Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Test Data
- Use mock data for consistent testing
- Avoid hardcoded values
- Create reusable test utilities

### 3. Assertions
- Test one thing per test
- Use specific assertions
- Avoid testing implementation details

### 4. Performance
- Mock external dependencies
- Use `beforeEach` for setup
- Clean up after tests

## 🎯 Next Steps

### Immediate Actions
1. **Run existing tests**: `npm run test`
2. **Fix any failures**: Address broken tests
3. **Add missing tests**: Cover untested components
4. **Set up CI/CD**: Configure GitHub Actions

### Future Enhancements
1. **Visual Regression Testing**: Screenshot comparisons
2. **Load Testing**: Performance under stress
3. **Security Testing**: Vulnerability scanning
4. **Cross-device Testing**: Real device testing

## 📞 Support

For testing questions or issues:
1. Check this documentation
2. Review test examples
3. Check GitHub Issues
4. Contact development team

---

**Happy Testing! 🧪✨**
