import AppError from './error'

export interface DataOrError<T> {
    data?: T
    error?: AppError
}
