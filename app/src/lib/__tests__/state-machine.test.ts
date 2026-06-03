import { describe, it, expect } from 'vitest'
import { criarMaquinaEstados } from '../state-machine'

type S = 'a' | 'b' | 'c'

const fsm = criarMaquinaEstados<S>({
  a: ['b'],
  b: ['a', 'c'],
  c: [],
})

describe('criarMaquinaEstados', () => {
  it('permite transições declaradas', () => {
    expect(fsm.podeTransicionar('a', 'b')).toBe(true)
    expect(fsm.podeTransicionar('b', 'c')).toBe(true)
  })

  it('rejeita transições não declaradas', () => {
    expect(fsm.podeTransicionar('a', 'c')).toBe(false)
    expect(fsm.podeTransicionar('c', 'a')).toBe(false)
  })

  it('retorna os estados alcançáveis', () => {
    expect(fsm.transicoesPara('b')).toEqual(['a', 'c'])
    expect(fsm.transicoesPara('a')).toEqual(['b'])
  })

  it('identifica estados terminais', () => {
    expect(fsm.ehTerminal('c')).toBe(true)
    expect(fsm.ehTerminal('a')).toBe(false)
  })

  it('é seguro para estados desconhecidos (defensivo)', () => {
    // Simula um valor vindo do banco fora do enum esperado.
    const desconhecido = 'x' as S
    expect(fsm.podeTransicionar(desconhecido, 'a')).toBe(false)
    expect(fsm.transicoesPara(desconhecido)).toEqual([])
    expect(fsm.ehTerminal(desconhecido)).toBe(true)
  })

  it('expõe o mapa de transições original', () => {
    expect(fsm.transicoes.a).toEqual(['b'])
  })
})
