import { GraphQLError } from 'graphql'
import AppError from './error'
import logger from './logger'
import envs from '../config/envs'

export default function errorResponder (error: AppError) {
    logger.error(error.message, error)
    const metadata = error.metadata
    return new GraphQLError(error.message, {
        extensions: {
            code: error.type,
            metadata: metadata instanceof Error ? undefined : metadata,
            stack: envs.isProd ? undefined : error.stack
        }
    })
}
