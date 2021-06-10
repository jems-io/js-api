import { ApiLogService } from "@jems/api-domain"

export class BuiltInLogService implements ApiLogService  {
    log(...message: any[]): void {
        console.log(...message)
    }
    logInfo(...message: any[]): void {
        console.info(...message)
    }
    logWarn(...message: any[]): void {
        console.warn(...message)
    }
    logError(...message: any[]): void {
        console.error(...message)
    }
}