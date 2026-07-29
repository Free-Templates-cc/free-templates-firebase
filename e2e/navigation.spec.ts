import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('click "Browse Templates" on home page goes to /templates', async ({ page }) => {
    await page.goto('/')

    // Click the "Browse Templates" link in the hero section
    const browseLink = page.locator('a[href="/templates"]').filter({ hasText: 'Browse Templates' })
    await browseLink.click()

    await page.waitForURL('/templates')
    await expect(page.locator('h1')).toContainText('Templates')
  })

  test('footer contains FAQ, Contact, Terms, Privacy links', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')

    // Check FAQ link in footer
    await expect(footer.locator('a[href="/faq"]')).toContainText('FAQ')

    // Check Contact link in footer
    await expect(footer.locator('a[href="/contact"]')).toContainText('Contact')

    // Check Terms of Service link in footer
    await expect(footer.locator('a[href="/terms"]')).toContainText('Terms of Service')

    // Check Privacy Policy link in footer
    await expect(footer.locator('a[href="/privacy"]')).toContainText('Privacy Policy')
  })
})
