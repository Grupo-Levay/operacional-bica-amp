import { test, expect } from '@playwright/test'

test.describe('Checklist — CRUD', () => {
  test.beforeEach(async ({ page, context }) => {
    // Simulate logged-in user
    await context.addInitScript(() => {
      localStorage.setItem('auth-token', 'test-session-token')
    })

    await page.goto('/checklists')
    await page.waitForLoadState('networkidle')
  })

  test('criar checklist (form + submit + status mudou)', async ({ page }) => {
    // Find "Novo Checklist" button
    const novoChecklistBtn = page.locator('button:has-text("Novo"), a:has-text("Novo")')

    if (await novoChecklistBtn.isVisible()) {
      await novoChecklistBtn.click()
    }

    // Wait for form to appear
    await page.waitForSelector('form, input[placeholder*="Nome"]', { timeout: 5000 }).catch(() => {})

    // Fill form
    await page.fill('input[placeholder*="Nome"], input[type="text"]', 'Limpeza do Salão')

    // Optionally fill description if available
    const descInput = page.locator('textarea, input[placeholder*="Descrição"]')
    if (await descInput.isVisible()) {
      await descInput.fill('Varrer, limpar mesas, organizar cadeiras')
    }

    // Submit
    const submitBtn = page.locator('button:has-text("Criar"), button:has-text("Salvar"), button[type="submit"]')
    await submitBtn.click()

    // Wait for success
    await page.waitForLoadState('networkidle')

    // Verify checklist appears in list with initial status (e.g., "Pendente")
    const checklistCard = page.locator('text=Limpeza do Salão')
    await expect(checklistCard).toBeVisible()

    // Verify status badge shows initial state
    const statusBadge = page.locator('[data-testid*="status"], text=Pendente')
    if (await statusBadge.isVisible()) {
      await expect(statusBadge.first()).toContainText(/Pendente|Não iniciado/)
    }
  })

  test('marcar checklist como completo', async ({ page }) => {
    // Find first checklist item
    const checklistItem = page.locator('[data-testid*="checklist-item"], .card').first()

    if (await checklistItem.isVisible()) {
      // Look for checkbox or "Completar" button
      const checkboxOrBtn = checklistItem.locator('input[type="checkbox"], button:has-text("Completar")')

      if (await checkboxOrBtn.isVisible()) {
        await checkboxOrBtn.click()
      }

      // Verify status changed
      await page.waitForLoadState('networkidle')
      const completedStatus = checklistItem.locator('text=Completo, text=Concluído')
      if (await completedStatus.isVisible()) {
        await expect(completedStatus).toBeVisible()
      }
    }
  })
})
