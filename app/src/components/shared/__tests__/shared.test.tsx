// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { PageHeader } from '../page-header'
import { EmptyState } from '../empty-state'
import { SectionLabel } from '../section-label'

afterEach(cleanup)

describe('PageHeader', () => {
  it('renderiza título como h1', () => {
    render(<PageHeader title="Estoque" />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toBe('Estoque')
  })

  it('renderiza subtitle e badge quando fornecidos', () => {
    render(<PageHeader title="Usuários" subtitle="Gestão" badge={<span>3</span>} />)
    expect(screen.getByText('Gestão')).toBeTruthy()
    expect(screen.getByText('3')).toBeTruthy()
  })

  it('não renderiza subtitle quando ausente', () => {
    render(<PageHeader title="Fichas" />)
    expect(screen.queryByText('Gestão')).toBeNull()
  })
})

describe('EmptyState', () => {
  it('renderiza apenas a mensagem quando não há ícone', () => {
    render(<EmptyState message="Sem reservas" />)
    expect(screen.getByText('Sem reservas')).toBeTruthy()
  })

  it('renderiza ícone e mensagem quando há ícone', () => {
    render(<EmptyState message="Vazio" icon={<svg data-testid="ic" />} />)
    expect(screen.getByTestId('ic')).toBeTruthy()
    expect(screen.getByText('Vazio')).toBeTruthy()
  })
})

describe('SectionLabel', () => {
  it('renderiza children como h2', () => {
    render(<SectionLabel>Abertura</SectionLabel>)
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2.textContent).toBe('Abertura')
  })
})
