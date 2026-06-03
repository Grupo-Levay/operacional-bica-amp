/**
 * Logger estruturado simples.
 * Usa console.* internamente com contexto [module-name].
 */

export const logger = {
  error: (message: string, error?: unknown) => {
    console.error(message, error)
  },
  warn: (message: string, data?: unknown) => {
    console.warn(message, data)
  },
  info: (message: string, data?: unknown) => {
    console.info(message, data)
  },
  debug: (message: string, data?: unknown) => {
    console.debug(message, data)
  },
}
