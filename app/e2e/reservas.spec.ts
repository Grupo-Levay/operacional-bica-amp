import { test, expect } from '@playwright/test'

test.describe('Reservas — CRUD', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set auth session in localStorage (simulates logged-in state)
    // In a real scenario, you'd seed a test user via API
    await context.addInitScript(() => {
      localStorage.setItem('auth-token', 'test-session-token')
    })

    await page.goto('/reservas')
    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test('criar reserva (form + submit + verificar lista)', async ({ page }) => {
    // Locate the "Nova Reserva" button/link
    const novaReservaBtn = page.locator('button:has-text("Nova Reserva"), a:has-text("Nova Reserva")')

    // If button doesn't exist, try to find form
    const form = page.locator('form')

    if (await novaReservaBtn.isVisible()) {
      await novaReservaBtn.click()
    }

    // Fill form fields (adjust selectors based on actual form)
    await page.fill('input[placeholder*="Nome"]', 'João Silva')
    await page.fill('input[type="date"]', '2026-06-10')
    await page.fill('input[type="time"]', '19:00')

    // Select a table/mesa if available
    const mesaSelect = page.locator('select:has-text("Mesa"), button:has-text("Mesa")')
    if (await mesaSelect.isVisible()) {
      await mesaSelect.first().click()
      await page.locator('text=Mesa 1').click()
    }

    // Submit form
    const submitBtn = page.locator('button:has-text("Confirmar"), button[type="submit"]')
    await submitBtn.click()

    // Wait for success feedback (toast or redirect)
    await page.waitForLoadState('networkidle')

    // Verify reservation appears in list
    const reservaCard = page.locator('text=João Silva')
    await expect(reservaCard).toBeVisible()
  })
})
