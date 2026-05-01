/**
 * Logger centralisé — à utiliser à la place de console dans les APIs et lib.
 * En production : erreurs structurées (timestamp, message, context).
 * En dev : console pour debug. Remplaçable par Pino/Winston plus tard.
 */

const isDev = process.env.NODE_ENV !== "production";

export type LogContext = Record<string, unknown>;

function formatMessage(level: string, message: string, context?: LogContext): string {
  const ts = new Date().toISOString();
  if (!context || Object.keys(context).length === 0) return `[${ts}] [${level}] ${message}`;
  return `[${ts}] [${level}] ${message} ${JSON.stringify(context)}`;
}

export const logger = {
  info(message: string, context?: LogContext): void {
    if (isDev) console.info(formatMessage("INFO", message, context));
  },
  warn(message: string, context?: LogContext): void {
    const out = formatMessage("WARN", message, context);
    if (isDev) console.warn(out);
    else console.warn(out);
  },
  error(message: string, error?: unknown, context?: LogContext): void {
    const errPayload =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
    const fullContext = { ...context, error: errPayload };
    const out = formatMessage("ERROR", message, fullContext);
    console.error(out);
  },
  /** Pour debug uniquement — ne pas logger en prod */
  debug(message: string, context?: LogContext): void {
    if (isDev) console.debug(formatMessage("DEBUG", message, context));
  },
};
