# XOIA Quality

## Check obrigatorio antes de push
```bash
npm run lint && npm test && npm run typecheck
```
Todos devem passar. Se falhar: corrija antes de continuar.

## CRO (Landing Pages — automatico no CHECK)
- Attention Ratio 1:1 | Message Match
- LCP < 2.5s | CLS < 0.1 | INP < 200ms
- MECLABS: C = 4m + 3v + 2(i-f) - 2a

## CodeRabbit (opcional)
```bash
wsl bash -c 'cd ${PROJECT_ROOT} && ~/.local/bin/coderabbit --prompt-only -t uncommitted'
```
