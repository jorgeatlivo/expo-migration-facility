/* eslint-disable no-console */

// import CrashlyticsService from '@/services/analytics/crashlytics.service';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

type LogParam =
  | string
  | number
  | boolean
  | object
  | Error
  | null
  | undefined
  | unknown;

// ANSI bright color codes
const LogColors: Record<LogLevel, string> = {
  [LogLevel.INFO]: '\x1b[36m', // Cyan
  [LogLevel.WARN]: '\x1b[93m', // Bright Yellow
  [LogLevel.ERROR]: '\x1b[91m', // Bright Red
  [LogLevel.DEBUG]: '\x1b[92m', // Bright Green
};

const ResetColor = '\x1b[0m';

export class Logger {
  /**
   * format message for console output
   */
  private static formatMessageConsoleOutput(
    level: LogLevel,
    message: string,
    ...optionalParams: LogParam[]
  ): [string, ...LogParam[]] {
    const timestamp = new Date().toISOString();
    const levelTag = `${LogColors[level]}[${level}]${ResetColor}`;
    const formattedMessage = `[${timestamp}] ${levelTag} ${message}`;
    return [formattedMessage, ...optionalParams];
  }

  private static safeStringifyParams(params: LogParam[]) {
    return params
      .map((param) => {
        if (param instanceof Error) {
          return `${param.name}: ${param.message}`;
        } else if (typeof param === 'object' && param !== null) {
          try {
            return JSON.stringify(param);
          } catch (error) {
            return '[Circular Reference]';
          }
        } else if (param === null || param === undefined) {
          return '';
        }

        return String(param);
      })
      .filter((predicate) => predicate !== '')
      .join(', ');
  }

  private static formatMessageCrashlyticsOutput(
    level: LogLevel,
    message: string,
    ...optionalParams: LogParam[]
  ): string {
    const paramsStr = this.safeStringifyParams(optionalParams);

    return `[${level}] ${message}` + (paramsStr ? `: ${paramsStr}` : '');
  }

  static info(message: string, ...optionalParams: LogParam[]): void {
    if (__DEV__) {
      console.log(
        ...this.formatMessageConsoleOutput(
          LogLevel.INFO,
          message,
          ...optionalParams
        )
      );
    } else {
      // const formattedMessage = this.formatMessageCrashlyticsOutput(
      //   LogLevel.INFO,
      //   message,
      //   ...optionalParams
      // );
      // CrashlyticsService.log(formattedMessage);
    }
  }

  static warn(message: string, ...optionalParams: LogParam[]): void {
    if (__DEV__) {
      console.warn(
        ...this.formatMessageConsoleOutput(
          LogLevel.WARN,
          message,
          ...optionalParams
        )
      );
    } else {
      // const formattedMessage = this.formatMessageCrashlyticsOutput(
      //   LogLevel.WARN,
      //   message,
      //   ...optionalParams
      // );
      // CrashlyticsService.log(formattedMessage);
    }
  }

  static error(
    name: string,
    error: unknown | Error,
    ...optionalParams: LogParam[]
  ): void {
    if (__DEV__) {
      console.error(
        ...this.formatMessageConsoleOutput(
          LogLevel.ERROR,
          name,
          { error },
          ...optionalParams
        )
      );
    } else {
      // const formattedMessage = this.formatMessageCrashlyticsOutput(
      //   LogLevel.ERROR,
      //   name,
      //   ...optionalParams
      // );
      // CrashlyticsService.trackError(error, {
      //   name: 'Logger.error',
      //   params: formattedMessage,
      // });
    }
  }

  static debug(message: string, ...optionalParams: LogParam[]): void {
    if (__DEV__) {
      console.debug(
        ...this.formatMessageConsoleOutput(
          LogLevel.DEBUG,
          message,
          ...optionalParams
        )
      );
    } else {
      // const formattedMessage = this.formatMessageCrashlyticsOutput(
      //   LogLevel.DEBUG,
      //   message,
      //   ...optionalParams
      // );
      // CrashlyticsService.log(formattedMessage);
    }
  }
}
