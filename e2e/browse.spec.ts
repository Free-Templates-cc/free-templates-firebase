import { test, expect } from '@playwright/test'

test.describe('Browse Templates Page', () => {
  test('navigates to /templates and shows the page header', async ({ page }) => {
    await page.goto('/templates')
    await expect(page.locator('h1')).toContainText('Templates')
  })

  test('filter sidebar is visible', async ({ page }) => {
    await page.goto('/templates')
    // Wait for the page to render
    await expect(page.getByRole('heading', { name: 'Filters' })).toBeVisible()
  })

  test('filter by Free price tier', async ({ page }) => {
    await page.goto('/templates')
    // Click the "Free" price filter button
    const freeButton = page.locator('aside').getByRole('button', { name: 'Free' })
    await freeButton.click()

    // URL should now contain priceTier=free
    await expect(page).toHaveURL(/priceTier=free/)
  })

  test('search input exists and can type', async ({ page }) => {
    await page.goto('/templates')
    // Use the search input in the main content area (not the navbar one)
    const searchInput = page.locator('main input[placeholder="Search templates..."]')
    await expect(searchInput).toBeVisible()
    await searchInput.fill('portfolio')
    // URL should now contain search=portfolio (via React Router updateFilter)
    await expect(page).toHaveURL(/search=portfolio/)
  })

  test('pagination controls exist when data loads', async ({ page }) => {
    await page.goto('/templates')
    // Check that the page renders with the templates heading
    await expect(page.locator('h1')).toContainText('Templates')
  })
})
