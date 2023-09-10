import axios from 'axios'
import { DataOrError } from './data_or_error'
import { Logger } from './logger'
import AppError from './error'

export class Http {
    logger: Logger
    error: AppError

    constructor() {
        this.logger = new Logger()
    }

    public async get<Res>(url: string, headers?: Record<string, string>): Promise<DataOrError<Res>> {
        try {
            const response = await axios.get(url, { headers: headers })
            return { data: response.data as Res }
        } catch (err) {
            const error = new AppError({ error: (err as Error), type: 'HTTP_ERROR' })
            return { error }
        }
    }

    public async post<Req, Res>(url: string, data: Req, headers?: Record<string, string>): Promise<DataOrError<Res>> {
        try {
            const response = await axios.post(url, data, { headers: headers })
            return { data: response.data as Res }
        } catch (err) {
            const error = new AppError({ error: (err as Error), type: 'HTTP_ERROR' })
            return { error }
        }
    }

    public async put<Req, Res>(url: string, data: Req, headers?: Record<string, string>): Promise<DataOrError<Res>> {
        try {
            const response = await axios.put(url, data, { headers: headers })
            return { data: response.data as Res }
        } catch (err) {
            const error = new AppError({ error: (err as Error), type: 'HTTP_ERROR' })
            return { error }
        }
    }

    public async delete<Res>(url: string, headers?: Record<string, string>): Promise<DataOrError<Res>> {
        try {
            const response = await axios.delete(url, { headers: headers })
            return { data: response.data as Res }
        } catch (err) {
            const error = new AppError({ error: (err as Error), type: 'HTTP_ERROR' })
            return { error }
        }
    }
}

export default new Http()
