/** Supported structured log severity levels. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

/** Structured logger interface for server-side diagnostics. */
export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

/**
 * Creates a lightweight JSON structured logger filtered by `minLevel`.
 */
export function createLogger(minLevel: LogLevel = 'info'): Logger {
  const minPriority = LOG_LEVEL_PRIORITY[minLevel];

  const write = (level: LogLevel, message: string, meta?: Record<string, unknown>): void => {
    if (LOG_LEVEL_PRIORITY[level] < minPriority) {
      return;
    }
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(meta ?? {}),
    };
    const serialized = JSON.stringify(entry);
    if (level === 'error') {
      console.error(serialized);
    } else if (level === 'warn') {
      console.warn(serialized);
    } else {
      console.log(serialized);
    }
  };

  return {
    debug: (message, meta) => write('debug', message, meta),
    info: (message, meta) => write('info', message, meta),
    warn: (message, meta) => write('warn', message, meta),
    error: (message, meta) => write('error', message, meta),
  };
}
