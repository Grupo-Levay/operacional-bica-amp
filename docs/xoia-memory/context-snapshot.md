# XOIA Context Snapshot — bica-amp

_Atualizado: 2026-05-22 | Branch: `claude/resume-project-Edze5`_

## Projeto
**App:** Sistema operacional interno — Bica Bar + AMP (parceria)
**Stack:** Next.js 15 · TypeScript · Supabase · Tailwind · base-ui/shadcn-ui
**Ambiente:** Cloud container remoto · `gh` CLI indisponível → usar `mcp__github__*`
**Supabase project ID:** `ducbzdfxzaifzqefolhy`

## Estrutura de arquivos críticos
```
app/src/app/(app)/          # Pages: dashboard, compras, estoque, fichas
app/src/app/actions/        # Server actions por módulo
app/src/components/         # compras/, estoque/, dashboard/, ui/
app/src/types/database.types.ts
app/src/lib/supabase/server.ts
```

## Módulos implementados
- ✅ Dashboard — métricas, checklists pendentes, estoque crítico
- ✅ Compras — rodadas, adicionar/remover itens do catálogo, marcar comprado, fechar rodada
- ✅ Estoque — listagem, alerta de estoque crítico
- ✅ Fichas Técnicas / CMV
- ✅ PWA — manifest, ícones, viewport, themeColor

## Tabelas Supabase (principais)
`rodadas` · `rodada_itens` · `compras_categorias` · `compras_itens`
`estoque` · `fichas_tecnicas` · `checklist_itens` · `checklist_registros`

## Decisões técnicas ativas
- **RLS:** políticas `USING (true)` — app usa anon key sem JWT. Auth futura requer revisão de RLS.
- **Server Actions:** Next.js server actions + `revalidatePath('/rota')` — sem API routes
- **CSS:** `--color-bica` para cor primária em todo o projeto
- **Imports:** alias `@/` configurado em tsconfig
- **Branch de dev:** sempre `claude/resume-project-Edze5`

## Últimos ships
1. `feat: compras — adicionar/remover itens da rodada aberta` (2026-05-22)
2. `feat: PWA — manifest, ícones gerados, viewport themeColor`
3. `fix: dashboard — checklists pendentes e estoque crítico`
4. `docs: registra aprendizado RLS multi-tenant no xoia-memory`

## Gaps conhecidos
- Sem testes automatizados implementados
- sessions.jsonl estava vazio (agora com protocolo de update no SHIP)
- Edição de quantidade de item na rodada (não implementado)
- Relatório CMV consolidado (pendente)

## Aprendizado crítico ativo
RLS Supabase multi-tenant: app com anon key + policies que checam `auth.uid()` retorna vazio SEM erro.
Fix: `CREATE POLICY ... FOR SELECT USING (true)`. Ver `docs/xoia-memory/learnings.md`.
