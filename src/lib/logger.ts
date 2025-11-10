type LogContext = Record<string, any>;

interface LogEntry {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  context?: LogContext;
  url?: string;
  userAgent?: string;
  sessionId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLogEntry(entry: LogEntry): string {
    return JSON.stringify(entry, null, this.isDevelopment ? 2 : 0);
  }

  private log(entry: LogEntry) {
    if (this.isDevelopment) {
      const color = {
        error: '\x1b[31m', // red
        warning: '\x1b[33m', // yellow
        info: '\x1b[36m', // cyan
        reset: '\x1b[0m',
      };

      console.log(
        `${color[entry.level]}[${entry.level.toUpperCase()}]${color.reset}`,
        this.formatLogEntry(entry)
      );
    } else {
      // TODO: Implement production logging service
      // Example integration with Sentry:
      // Sentry.captureMessage(entry.message, {
      //   level: entry.level,
      //   extra: entry.context,
      // });
    }
  }

  logError(error: Error, context?: LogContext) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      context: {
        ...context,
        stack: error.stack,
        name: error.name,
      },
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      // TODO: Add session ID from your auth system
      // sessionId: getSessionId(),
    };

    this.log(entry);
  }

  logWarning(message: string, context?: LogContext) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.log(entry);
  }

  logInfo(message: string, context?: LogContext) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.log(entry);
  }
}

export const logger = new Logger();
export const { logError, logWarning, logInfo } = logger;