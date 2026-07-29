import { test, expect } from '@playwright/test'

test.describe('Static Pages', () => {
  test('/terms — heading exists', async ({ page }) => {
    await page.goto('/terms')
    await expect(page.locator('h1')).toContainText('Terms of Service')
  })

  test('/privacy — heading exists', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.locator('h1')).toContainText('Privacy Policy')
  })

  test('/contact — heading exists', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('h1')).toContainText('Contact Us')
  })

  test('/faq — heading exists', async ({ page }) => {
    await page.goto('/faq')
    await expect(page.locator('h1')).toContainText('Frequently Asked Questions')
  })

  test('/404 — 404 page renders', async ({ page }) => {
    await page.goto('/nonexistent-route')
    // The NotFoundPage shows a big "404" heading and "Page not found" text
    await expect(page.locator('h1')).toContainText('404')
    await expect(page.locator('text=Page not found')).toBeVisible()
  })
})
