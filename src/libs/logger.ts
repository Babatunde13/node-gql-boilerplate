import AppError from './error'
import pkg from '../../package.json'
import envs from '../config/envs'

export class Logger {
    level: string
    name: string
    version: string

    constructor() {
        this.level = process.env.LOG_LEVEL || 'debug'
        this.name = process.env.APP_NAME || pkg.name
        this.version = process.env.APP_VERSION || pkg.version
    }

    debug(message: string, data?: unknown) {
        if (this.level === 'debug') {
            this.log('debug', message, data)
        }
    }

    info(message: string, data?: unknown) {
        this.log('info', message, data)
    }

    warn(message: string, data?: unknown) {
        this.log('warn', message, data)
    }

    error(message: string, error?: AppError) {
        this.log('error', message, {
            isAppError: error instanceof AppError,
            error: error?.message,
            type: error?.type,
            metadata: error?.metadata,
            stack: error?.stack,
            name : error?.name
        })
    }

    private getConsoleColor(level: string) {
        switch (level) {
        case 'debug':
            return '\x1b[34m'
        case 'info':
            return '\x1b[32m'
        case 'warn':
            return '\x1b[33m'
        case 'error':
            return '\x1b[31m'
        default:
            return '\x1b[37m'
        }
    }

    private logToConsole(level: string, message: string, data?: unknown) {
        const log = this.getLogMessage(level, message, data)
        console.log(`${this.getConsoleColor(level)}${JSON.stringify(log, null, 4)}\x1b[0m`)
    }

    private getLogMessage(level: string, message: string, data?: unknown) {
        const log = { level, message, data, name: this.name, timestamp: new Date().toISOString() }
        return log
    }

    log(level: string, message: string, data?: unknown) {
        if (envs.env === 'production') {
            // log to sentry
        } else if (envs.env === 'test') {
            // log to file
        } else {
            this.logToConsole(level, message, data)
        }
    }
}

export default new Logger()
