# XOIA Tools

## Prioridade: nativo primeiro
Read / Write / Edit / Bash / Glob / Grep > MCP sempre.

## MCP — quando usar
| MCP | Quando |
|-----|--------|
| playwright | Browser automation, screenshots |
| desktop-commander | Docker container |
| EXA | Web search, competitor analysis |
| Context7 | Docs de bibliotecas |
| Apify | Web scraping, social data |
| mcp__github__* | PRs, issues, CI (gh CLI indisponível neste ambiente) |
| mcp__45d670d4__* | Supabase SQL, migrations, logs remotos |

## Git
`git diff --stat` · `git log --oneline -10` · `git push -u origin <branch>`

## Supabase
`supabase db push` · `supabase migration list` · prefer MCP para operações remotas

## Filtro de respostas MCP
Extraia só campos relevantes — descarte navegação, ads, boilerplate.

## Known Issues
Docker MCP secrets quebrado. Fix: edite `~/.docker/mcp/catalogs/docker-mcp.yaml` com valores hardcoded.
