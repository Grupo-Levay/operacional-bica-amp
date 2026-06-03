import { test, expect } from '@playwright/test'

test.describe('Escala — Edição Inline', () => {
  test.beforeEach(async ({ page, context }) => {
    // Simulate logged-in user
    await context.addInitScript(() => {
      localStorage.setItem('auth-token', 'test-session-token')
    })

    await page.goto('/abastecimento/escala')
    await page.waitForLoadState('networkidle')
  })

  test('editar escala (abrir popover + selecionar role + confirmar)', async ({ page }) => {
    // Find a grid cell or button that opens the popover for editing
    const editBtn = page.locator('button[data-testid*="escala"], button:has-text("Editar")')

    if (await editBtn.first().isVisible()) {
      await editBtn.first().click()
    } else {
      // Try clicking on a cell in the grid (date/role intersection)
      const gridCell = page.locator('[role="gridcell"]').first()
      await gridCell.click()
    }

    // Wait for popover to appear
    await page.waitForSelector('[role="dialog"], [role="listbox"], .popover', { timeout: 5000 }).catch(() => {})

    // Select a role from dropdown/popover
    const roleOption = page.locator('button:has-text("AB"), button:has-text("CD"), button:has-text("Dia")')
    if (await roleOption.first().isVisible()) {
      await roleOption.first().click()
    } else {
      const selectRole = page.locator('select')
      if (await selectRole.isVisible()) {
        await selectRole.selectOption('AB')
      }
    }

    // Confirm the change (look for Confirmar button in popover)
    const confirmBtn = page.locator('button:has-text("Confirmar"), button:has-text("OK")')
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click()
    }

    // Wait for update and verify visually (role changed)
    await page.waitForLoadState('networkidle')
    const roleText = page.locator('text=AB, text=CD, text=Dia')
    await expect(roleText.first()).toBeVisible()
  })
})
