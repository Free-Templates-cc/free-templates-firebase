import { test, expect } from '@playwright/test'

test.describe('Pricing Page', () => {
  test('navigates to /pricing and shows the heading', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.locator('h1')).toContainText('Simple, Transparent Pricing')
  })

  test('both Free and Premium pricing cards are visible', async ({ page }) => {
    await page.goto('/pricing')
    // The plan names are h2 elements within the pricing cards
    await expect(page.locator('h2').filter({ hasText: 'Free' })).toBeVisible()
    await expect(page.locator('h2').filter({ hasText: 'Premium' })).toBeVisible()
  })

  test('toggle yearly/monthly shows different prices', async ({ page }) => {
    await page.goto('/pricing')

    // Initially monthly: Premium shows €12
    await expect(page.locator('text=€12')).toBeVisible()

    // Click the toggle button (the switch between Monthly and Yearly labels)
    const toggleBtn = page.locator('button.relative.h-6.w-11')
    await toggleBtn.click()

    // Now yearly: Premium should show €96
    await expect(page.locator('text=€96')).toBeVisible()
  })
})
