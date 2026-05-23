# Context Snapshot — Bica Operacional

_Atualizado: 2026-05-23 | Branch: claude/blissful-turing-lVZPh_

## Projeto
App: Painel operacional do bar BiCA — gestão de checklists, estoque, escala, compras e fichas técnicas
Stack: Next.js 16.2.6 (App Router) + TypeScript + Supabase (Auth + DB) + Tailwind CSS + Vercel
Ambiente: Container remoto Claude Code; deploy automático na Vercel (projeto `bica-bar-system`)

## Arquivos críticos
`app/src/proxy.ts`                                    → proteção de rotas (Next.js 16 — NÃO middleware.ts)
`app/src/lib/supabase/proxy.ts`                       → updateSession() com cookie forwarding SSR
`app/src/lib/supabase/server.ts`                      → createClient() para Server Components e Actions
`app/src/lib/supabase/client.ts`                      → createClient() para Client Components
`app/src/lib/roles.ts`                                → type Role + rotasPermitidas(role)
`app/src/lib/onboarding.ts`                           → getOnboardingConfig() por role
`app/src/app/actions/auth.ts`                         → signIn, signOut, resetPassword, updatePassword
`app/src/app/(auth)/login/login-form.tsx`             → form login com useActionState
`app/src/app/(auth)/recuperar-senha/`                 → flow reset password
`app/src/app/(auth)/atualizar-senha/`                 → flow set new password
`app/src/app/auth/callback/route.ts`                  → PKCE exchange code → session
`app/src/app/(app)/layout.tsx`                        → layout protegido: busca perfil + onboarding
`app/src/components/layout/sidebar.tsx`               → nav desktop filtrado por role
`app/src/components/layout/bottom-nav.tsx`            → nav mobile filtrado por role
`app/src/components/onboarding/onboarding-modal.tsx`  → modal 2-step onboarding por role

## Estado atual
✅ Design system — dark theme + brand guide BiCA
✅ Sidebar desktop + BottomNav mobile responsivos
✅ Supabase Auth — login email+senha com proteção de rotas via proxy.ts
✅ Tabela `perfis` com roles + RLS + trigger auto-create
✅ Navegação filtrada por role (super_admin/admin/operacional/estoque/cmv/bar)
✅ Onboarding modal guiado por role no primeiro acesso
✅ Recuperação de senha por e-mail (resetPasswordForEmail + PKCE callback)
🔄 Admin panel para gestão de roles (próximo ciclo)
⬜ Página pública `/cardapio`
⬜ Módulos: checklists, estoque, escala, compras, fichas técnicas

## Decisões técnicas ativas
- `proxy.ts` (não `middleware.ts`): Next.js 16 renomeou o arquivo de interceptação de rotas
- `getUser()` (não `getSession()`): única chamada segura para auth decisions no server
- PKCE flow via `/auth/callback`: `exchangeCodeForSession(code)` antes de redirecionar
- `useActionState` + Server Actions: pattern para forms com pending state (não `useState`)
- Supabase MCP (`ducbzdfxzaifzqefolhy`): usa ferramenta `execute_sql` para migrações remotas

## Últimos ships
1. feat: recuperação de senha por e-mail (2026-05-22)
2. feat: onboarding guiado por role no primeiro acesso (2026-05-22)
3. feat: autenticação completa com Supabase Auth + proteção de rotas por role (2026-05-22)
4. feat: sidebar desktop — wordmark BiCA + nav responsivo (2026-05-21)
5. feat: design system — dark theme + brand guide BICA v2 (2026-05-21)

## Gaps conhecidos
- Usuário `quentalgabriel@gmail.com` pode não ter senha definida — foi criado antes do trigger; precisa de reset via Supabase Dashboard se ainda não conseguiu logar
- Módulos do dashboard (checklists, estoque etc.) existem como páginas vazias — sem lógica de negócio
- Sem testes unitários ainda — `npm test` passa por não ter specs
