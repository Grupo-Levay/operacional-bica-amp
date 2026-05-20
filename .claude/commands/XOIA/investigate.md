# /investigate — XOIA Root-Cause Debugger

ACTIVATION-NOTICE: Você está em modo INVESTIGATE.

Siga a metodologia abaixo na ordem exata. Não salte para o fix.
A causa raiz primeiro — sempre.

## COMPLETE COMMAND DEFINITION

```yaml
command: investigate
icon: "🔍"
description: Root-cause debugging. Não conserta o sintoma — encontra a causa.
activation: /XOIA:investigate
args:
  - name: description
    required: false
    description: "Descrição do problema (opcional — se não fornecida, pergunta)"

phases:
  - OBSERVE
  - HYPOTHESIZE
  - BISECT
  - ISOLATE
  - FIX
  - VERIFY
```

---

## FASE 1 — OBSERVE

Antes de qualquer ação, entenda o problema completamente.

Perguntas obrigatórias — responda antes de continuar:
1. **Sintoma:** O que exatamente acontece? O que deveria acontecer?
2. **Reprodução:** É consistente? Em quais condições específicas?
3. **Quando começou:** Última mudança antes do problema aparecer?
4. **Contexto:** Browser/Node/edge? Dev/prod? Qual versão?
5. **Evidências:** Mensagem de erro exata, stack trace, logs

Se o usuário não forneceu todas essas informações → PERGUNTE antes de prosseguir.

---

## FASE 2 — HYPOTHESIZE

Liste 3-5 hipóteses ordenadas por probabilidade (mais provável primeiro).

Para cada hipótese:
- O que causaria esse sintoma?
- Em qual arquivo/função/query/config isso estaria?
- Como testar essa hipótese com o mínimo de mudanças?

Formato obrigatório:
```
[ ] H1: <hipótese> — Probabilidade: Alta
    Testar com: <ação mínima>
[ ] H2: <hipótese> — Probabilidade: Média
    Testar com: <ação mínima>
[ ] H3: <hipótese> — Probabilidade: Baixa
    Testar com: <ação mínima>
```

---

## FASE 3 — BISECT

Para cada hipótese (da mais provável), investigue antes de alterar código:

```bash
git log --oneline -20                        # últimas mudanças
git diff HEAD~1 -- <arquivo suspeito>        # o que mudou?
git log --all --oneline -- <arquivo>         # histórico do arquivo
```

Se o bug foi introduzido por um commit específico:
```bash
git bisect start
git bisect bad                               # commit atual (com bug)
git bisect good <commit-sha-anterior>        # commit sem bug
```

Padrões comuns a investigar:
- Import quebrado / versão errada de dependência
- Mudança silenciosa em contrato de API (parâmetros, retorno esperado)
- `async/await` faltando em função assíncrona
- Environment variable ausente ou com valor errado
- Migração de banco não aplicada (`supabase migration list`)
- Cache stale (`.next/`, `node_modules/`, build output)
- Hydration mismatch (Next.js SSR vs. client)
- RLS policy do Supabase bloqueando sem erro visível

---

## FASE 4 — ISOLATE

Confirme a causa raiz com o mínimo de intervenção:

1. Adicione log estratégico (não mude lógica ainda):
   ```typescript
   console.log('[INVESTIGATE]', { variavel, valor, contexto })
   ```

2. Comente código suspeito temporariamente para confirmar hipótese

3. Escreva um teste unitário mínimo que reproduza o bug:
   ```typescript
   it('reproduz bug: <descrição curta>', () => {
     // setup mínimo
     expect(resultado).toBe(esperado)  // vai falhar — e isso é bom
   })
   ```

**CONFIRMAÇÃO OBRIGATÓRIA antes de passar para FIX:**
> "Revertendo APENAS [linha/função/config específica], o problema some?"

Se sim → causa raiz encontrada. Vá para FIX.
Se não → volte para HYPOTHESIZE com a nova informação obtida.

---

## FASE 5 — FIX

Corrija a **causa raiz**, não o sintoma.

Regras do fix:
- Altere o mínimo necessário para resolver a causa raiz
- Se o fix exige refactor grande → cria story para o refactor, não hackeia agora
- Remova todos os `console.log('[INVESTIGATE]')` antes do commit
- Se escreveu teste de reprodução → mantenha-o como teste de regressão

Commit:
```
fix: <causa raiz em uma linha> [Story X.X se aplicável]
```

Exemplos bons:
```
fix: null check em getUser() quando sessão expira
fix: await faltando em fetchEstoque causando render vazio
fix: SUPABASE_URL indefinida em ambiente de preview
fix: RLS policy bloqueando select de checklists para role anon
```

Exemplos ruins:
```
fix: bug no modal          ← vago demais
fix: problema de fetch     ← não descreve a causa raiz
```

---

## FASE 6 — VERIFY

```bash
npm run lint && npm test && npm run typecheck
```

Checklist de saída:
- [ ] O bug não reproduz mais nas condições originais
- [ ] Nenhum teste existente quebrou
- [ ] O fix não introduziu regressão nos caminhos adjacentes
- [ ] Logs de debug removidos
- [ ] Teste de regressão mantido (se escrito)

Se algum check falhar → volte para ISOLATE. Não faça force push. Entenda o porquê.

---

## Após o VERIFY

Registre o aprendizado se a causa raiz tiver valor futuro:
```bash
# Append em docs/xoia-memory/learnings.md
## [DATA] — <título do aprendizado>
**Contexto:** o que estava sendo feito
**Causa raiz:** o que causou o bug
**Sinal de alerta:** como reconhecer esse padrão antes que vire bug
---
```

---

*XOIA — /investigate | "Fix the cause, not the symptom"*
