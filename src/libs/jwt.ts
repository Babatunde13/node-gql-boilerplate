import jwt from 'jsonwebtoken'
import envs from '../config/envs'
import logger from './logger'
import AppError from './error'
import { DataOrError } from './data_or_error'
import { isValidObjectId } from './validations/validate_scalars'

export enum JwtType {
    ACCESS = 'auth',
    REFRESH = 'refresh',
    VERIFY_ACCOUNT = 'verify',
    RESET_PASSWORD = 'reset'
}

export interface JwtPayload {
    _id: string
    role?: string
    type?: JwtType
    email?: string
}

export const verifyJwt = (token: string, type: JwtType = JwtType.ACCESS): DataOrError<JwtPayload> => {
    try {
        const data = jwt.verify(token, envs.secrets.jwt) as JwtPayload
        if (data.type !== type) {
            return {
                error: new AppError({ message: 'Invalid token', type: 'INVALID_TOKEN' })
            }
        }

        if (!data._id || !isValidObjectId(data._id)) {
            return {
                error: new AppError({ message: 'Invalid token', type: 'INVALID_TOKEN' })
            }
        }
        return { data }
    } catch (error) {
        const err = new AppError({
            message: 'Error verifying jwt',
            type: 'JWT_VERIFICATION_ERROR',
            metadata: {
                error: (error as Error).message
            }
        })
        return { error: err }
    }
}

export const createJwt = (data: JwtPayload, options?: { expiresIn: string}) => {
    try {
        data.type = data.type || JwtType.ACCESS
        const token = jwt.sign(data, envs.secrets.jwt, { expiresIn: options?.expiresIn || '1d' }) as string
        return { data: token }
    } catch (error) {
        const err = new AppError({
            message: 'Error creating jwt',
            type: 'JWT_CREATION_ERROR',
            metadata: {
                error: (error as Error).message
            }
        })
        logger.error('Error creating jwt', err)
        return { error: err }
    }
}

export const createRefreshToken = (data: { _id: string, role: string }) => {
    return createJwt({ _id: data._id, role: data.role, type: JwtType.REFRESH }, { expiresIn: '31d' })
}

export const createAccessToken = (data: { _id: string, role: string }) => {
    return createJwt({ _id: data._id, role: data.role, type: JwtType.ACCESS })
}

export const createAuthTokens = (data: { _id: string, role: string }) => {
    const refreshToken = createRefreshToken(data)
    if (refreshToken.error) {
        return { error: refreshToken.error }
    }
    const accessToken = createAccessToken(data)
    if (accessToken.error) {
        return { error: accessToken.error }
    }
    const accessExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const refreshExpires = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)
    return {
        data: {
            refreshToken: { token: refreshToken.data, expires: refreshExpires.toISOString() },
            accessToken: { token: accessToken.data, expires: accessExpires.toISOString() }
        }
    }
}

