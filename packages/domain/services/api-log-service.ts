export interface ApiLogService {
    lig(...message: any[]): void
    logInfo(...message: any[]): void
    ligWarn(...message: any[]): void
    ligError(...message: any[]): void
}