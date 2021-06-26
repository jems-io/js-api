import { ApiLogService } from "@jems/api-domain";

export class NoOpLogService implements ApiLogService {
  log(...message: any[]): void {
    // No-Op
  }

  logInfo(...message: any[]): void {
    // No-Op
  }

  logWarn(...message: any[]): void {
    // No-Op
  }

  logError(...message: any[]): void {
    // No-Op
  }

  debug(...message: any[]): void {
    // No-Op
  }
}
