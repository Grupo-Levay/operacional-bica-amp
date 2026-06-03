/**
 * Logger estruturado.
 *
 * Emite uma linha JSON por log com { ts, level, msg, ...contexto }, mantendo
 * as assinaturas legadas `error/warn/info/debug(message, data?)` para não
 * quebrar chamadas existentes (que já prefixam o módulo como `[module] msg`).
 *
 * Use `logger.child('module')` para anexar contexto fixo (módulo, casa, etc.)
 * a todas as linhas — útil em Server Actions instrumentadas.
 */

type LogLevel = "error" | "warn" | "info" | "debug"

type LogContext = Record<string, unknown>

function serializeError(error: unknown): unknown {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack }
  }
  return error
}

function emit(level: LogLevel, message: string, data: unknown, context: LogContext) {
  const entry: Record<string, unknown> = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...context,
  }
  if (data !== undefined) {
    entry.data = level === "error" ? serializeError(data) : data
  }
  // console.* preserva o nível para infra de logs (Vercel/stdout) filtrar.
  const line = JSON.stringify(entry)
  if (level === "error") console.error(line)
  else if (level === "warn") console.warn(line)
  else if (level === "info") console.info(line)
  else console.debug(line)
}

function createLogger(context: LogContext = {}) {
  return {
    error: (message: string, error?: unknown) => emit("error", message, error, context),
    warn: (message: string, data?: unknown) => emit("warn", message, data, context),
    info: (message: string, data?: unknown) => emit("info", message, data, context),
    debug: (message: string, data?: unknown) => emit("debug", message, data, context),
    /** Cria um logger derivado com contexto fixo adicional (módulo, casa, action...). */
    child: (childContext: LogContext) => createLogger({ ...context, ...childContext }),
  }
}

export const logger = createLogger()
