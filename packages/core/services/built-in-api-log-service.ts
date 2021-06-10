import { ApiLogService } from "@jems/api-domain"

export class BuiltInLogService implements ApiLogService  {
    lig(...message: any[]): void {
        console.log(...message)
    }
    logInfo(...message: any[]): void {
        console.info(...message)
    }
    ligWarn(...message: any[]): void {
        console.warn(...message)
    }
    ligError(...message: any[]): void {
        console.error(...message)
    }
}