/**
 * Máquina de estados genérica e reutilizável.
 *
 * Centraliza a lógica de transições antes duplicada em `actions/reservas.ts`
 * e `actions/tarefas.ts`. Cada domínio declara apenas seu mapa de transições
 * e ganha os mesmos helpers de validação — sem copiar/colar a regra.
 *
 * @example
 * const fsm = criarMaquinaEstados<'a_fazer' | 'fazendo' | 'concluida'>({
 *   a_fazer: ['fazendo'],
 *   fazendo: ['a_fazer', 'concluida'],
 *   concluida: ['fazendo'],
 * })
 * fsm.podeTransicionar('a_fazer', 'concluida') // false
 */
export interface MaquinaEstados<S extends string> {
  /** Mapa de transições declarado pelo domínio. */
  readonly transicoes: Readonly<Record<S, readonly S[]>>
  /** `true` se `atual → novo` é uma transição permitida. */
  podeTransicionar(atual: S, novo: S): boolean
  /** Lista de estados alcançáveis a partir de `atual` (nunca `undefined`). */
  transicoesPara(atual: S): readonly S[]
  /** `true` se o estado não tem saídas (estado terminal). */
  ehTerminal(estado: S): boolean
}

export function criarMaquinaEstados<S extends string>(
  transicoes: Record<S, readonly S[]>,
): MaquinaEstados<S> {
  return {
    transicoes,
    podeTransicionar: (atual, novo) => (transicoes[atual] ?? []).includes(novo),
    transicoesPara: (atual) => transicoes[atual] ?? [],
    ehTerminal: (estado) => (transicoes[estado] ?? []).length === 0,
  }
}
