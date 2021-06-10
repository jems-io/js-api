export interface ApiLogService {
    log(...message: any[]): void
    logInfo(...message: any[]): void
    logWarn(...message: any[]): void
    logError(...message: any[]): void
}