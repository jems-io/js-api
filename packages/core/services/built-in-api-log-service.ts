import { ApiLogService } from "@jems/api-domain"

export class BuiltInLogService implements ApiLogService  {
    log(...message: any[]): void {
        console.log(`[${(new Date()).toISOString()}] `, ...message)
    }

    logInfo(...message: any[]): void {
        console.info(`[${(new Date()).toISOString()}] `,...message)
    }

    logWarn(...message: any[]): void {
        console.warn(`[${(new Date()).toISOString()}] `,...message)
    }

    logError(...message: any[]): void {
        console.error(`[${(new Date()).toISOString()}] `,...message)
    }

    debug(...message: any[]): void {
        console.debug(`[${(new Date()).toISOString()}] `,...message)
    }
}