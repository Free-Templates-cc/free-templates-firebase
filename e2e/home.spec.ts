import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('page loads with hero section visible', async ({ page }) => {
    await page.goto('/')
    // Hero heading
    await expect(page.locator('h1')).toContainText('Templates')
  })

  test('navbar exists with logo text FreeTemplates', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header a[href="/"]')).toContainText('FreeTemplates')
  })

  test('at least one category card is visible', async ({ page }) => {
    await page.goto('/')
    const categoryCards = page.locator('section').filter({ hasText: 'Browse by Category' }).locator('a[href^="/templates?category="]')
    await expect(categoryCards.first()).toBeVisible()
    // Verify there are multiple categories
    const count = await categoryCards.count()
    expect(count).toBeGreaterThanOrEqual(6)
  })

  test('search input exists', async ({ page }) => {
    await page.goto('/')
    // Use the search input in the hero section (main content area)
    const searchInput = page.locator('main input[placeholder="Search templates..."]')
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toBeEnabled()
  })
})
