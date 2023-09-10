import { Context } from '../types/base_req.types'
import errorResponder from './error_responder'
import AppError from './error'

export const ensureAuthorized = (context: Context) => {
    if (!context.user) {
        throw errorResponder(new AppError({ message: 'Unauthorized', type: 'UNAUTHORIZED' }))
    }
}
