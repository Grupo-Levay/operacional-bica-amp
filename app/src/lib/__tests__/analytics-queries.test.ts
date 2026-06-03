import { describe, it, expect } from "vitest"
import { percentil, ratingWebVital } from "../analytics-queries"

describe("percentil", () => {
  it("retorna 0 para lista vazia", () => {
    expect(percentil([], 75)).toBe(0)
  })

  it("calcula P75 (nearest-rank) de uma lista ordenada", () => {
    // 4 valores: ceil(0.75*4)-1 = 2 → índice 2 → 30
    expect(percentil([10, 20, 30, 40], 75)).toBe(30)
  })

  it("ordena antes de calcular (não depende da ordem de entrada)", () => {
    expect(percentil([40, 10, 30, 20], 75)).toBe(30)
  })

  it("P100 retorna o maior valor", () => {
    expect(percentil([1, 2, 3], 100)).toBe(3)
  })

  it("P0 (ou baixo) retorna o menor valor", () => {
    expect(percentil([5, 9, 1], 1)).toBe(1)
  })

  it("lista de um elemento retorna o próprio valor", () => {
    expect(percentil([42], 75)).toBe(42)
  })
})

describe("ratingWebVital", () => {
  it("classifica LCP conforme thresholds oficiais", () => {
    expect(ratingWebVital("LCP", 2000)).toBe("good")
    expect(ratingWebVital("LCP", 3000)).toBe("needs-improvement")
    expect(ratingWebVital("LCP", 5000)).toBe("poor")
  })

  it("trata limites exatos como o melhor lado (<= bom)", () => {
    expect(ratingWebVital("LCP", 2500)).toBe("good")
    expect(ratingWebVital("LCP", 4000)).toBe("needs-improvement") // 4000 não é > 4000
  })

  it("classifica CLS (adimensional)", () => {
    expect(ratingWebVital("CLS", 0.05)).toBe("good")
    expect(ratingWebVital("CLS", 0.2)).toBe("needs-improvement")
    expect(ratingWebVital("CLS", 0.3)).toBe("poor")
  })

  it("classifica INP", () => {
    expect(ratingWebVital("INP", 150)).toBe("good")
    expect(ratingWebVital("INP", 600)).toBe("poor")
  })

  it("métrica desconhecida cai em needs-improvement", () => {
    expect(ratingWebVital("DESCONHECIDA", 123)).toBe("needs-improvement")
  })
})
