# XOIA Tools

## Nativos primeiro (SEMPRE)

| Task | Tool |
|------|------|
| Ler arquivos | `Read` |
| Escrever/editar | `Write` / `Edit` |
| Comandos shell | `Bash` |
| Buscar arquivos | `Glob` |
| Buscar conteudo | `Grep` |

## MCP — quando usar

| MCP | Quando |
|-----|--------|
| **playwright** | Browser automation, screenshots |
| **desktop-commander** | Docker operations |
| **EXA** | Web search, research |
| **Context7** | Docs de libs externas |
| **Apify** | Scraping, social media |

## Known Issues
**Docker MCP Secrets Bug:** template interpolation quebrado. Fix: editar `~/.docker/mcp/catalogs/docker-mcp.yaml` com valores hardcoded.
