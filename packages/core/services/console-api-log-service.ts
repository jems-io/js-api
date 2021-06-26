import { ApiLogService } from "@jems/api-domain";
import { LogLevel } from "../models";

const DEFAULT_CONFIGURATION: ConsoleApiLogServiceConfiguration = {
  level: LogLevel.info,
};

export interface ConsoleApiLogServiceConfiguration {
  level: LogLevel;
}

export class ConsoleApiLogService implements ApiLogService {
  private readonly configuration: ConsoleApiLogServiceConfiguration;
  constructor(configuration: Partial<ConsoleApiLogServiceConfiguration> = {}) {
    this.configuration = Object.assign(
      {},
      DEFAULT_CONFIGURATION,
      configuration
    );
  }

  log(...message: any[]): void {
    this.configuration.level >= LogLevel.default &&
      console.log(`[${new Date().toISOString()}] `, ...message);
  }

  logInfo(...message: any[]): void {
    this.configuration.level >= LogLevel.info &&
      console.info(`[${new Date().toISOString()}] `, ...message);
  }

  logWarn(...message: any[]): void {
    this.configuration.level >= LogLevel.warning &&
      console.warn(`[${new Date().toISOString()}] `, ...message);
  }

  logError(...message: any[]): void {
    this.configuration.level >= LogLevel.error &&
      console.error(`[${new Date().toISOString()}] `, ...message);
  }

  debug(...message: any[]): void {
    this.configuration.level >= LogLevel.debug &&
      console.debug(`[${new Date().toISOString()}] `, ...message);
  }
}
