#!/bin/bash
set -euo pipefail

# Executa apenas em ambiente remoto (claude.ai/code)
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Injeta context-snapshot imediatamente (síncrono, leitura de arquivo — rápido)
SNAPSHOT="$CLAUDE_PROJECT_DIR/docs/xoia-memory/context-snapshot.md"
if [ -f "$SNAPSHOT" ]; then
  echo "<context-snapshot>"
  cat "$SNAPSHOT"
  echo "</context-snapshot>"
fi

# Instala dependências do app (node_modules é cacheado entre sessões)
cd "$CLAUDE_PROJECT_DIR/app"
npm install --prefer-offline --no-audit --no-fund 2>&1 | tail -3
