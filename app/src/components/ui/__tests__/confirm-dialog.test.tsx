// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { ConfirmDialog } from '../confirm-dialog'

vi.mock('@/components/ui/toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

afterEach(cleanup)

function setup(onConfirm = vi.fn()) {
  render(
    <ConfirmDialog
      trigger={<button>Excluir</button>}
      title="Remover item?"
      description="Ação irreversível."
      confirmLabel="Remover"
      onConfirm={onConfirm}
    />,
  )
  return { onConfirm }
}

describe('ConfirmDialog', () => {
  it('não mostra o diálogo antes de clicar no trigger', () => {
    setup()
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('abre o diálogo ao clicar no trigger', () => {
    setup()
    fireEvent.click(screen.getByText('Excluir'))
    expect(screen.getByRole('alertdialog')).toBeTruthy()
    expect(screen.getByText('Remover item?')).toBeTruthy()
    expect(screen.getByText('Ação irreversível.')).toBeTruthy()
  })

  it('não chama onConfirm ao cancelar e fecha o diálogo', () => {
    const { onConfirm } = setup()
    fireEvent.click(screen.getByText('Excluir'))
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('chama onConfirm ao confirmar', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    setup(onConfirm)
    fireEvent.click(screen.getByText('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Remover' }))
    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce())
  })
})
