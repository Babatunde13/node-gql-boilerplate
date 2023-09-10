import { AuthOutput, MutationRefreshAccessTokenArgs } from '../../../../../generated/graphql'
import errorResponder from '../../../../libs/error_responder'
import AppError from '../../../../libs/error'
import isError from '../../../../libs/is_error'
import { JwtType, createAuthTokens, verifyJwt } from '../../../../libs/jwt'
import logger from '../../../../libs/logger'
import { isValidJwtToken } from '../../../../libs/validations/validate_scalars'
import userModel from '../../../../models/user.model'
import { ParentType } from '../../../../types/base_req.types'

export default async function refreshAccessTokenResolver (_: ParentType, { input }: MutationRefreshAccessTokenArgs): Promise<AuthOutput> {
    const validateInput = isValidJwtToken(input.token)
    if (!validateInput) {
        const error = new AppError({ message: 'Invalid Input', type: 'VALIDATION_ERROR', metadata: { token: 'Invalid token' } })
        throw errorResponder(error)
    }

    const verifyToken = verifyJwt(input.token, JwtType.REFRESH)
    if (isError(verifyToken) || !verifyToken.data) {
        throw errorResponder(verifyToken.error || new AppError({ message: 'Error verifying refresh token', type: 'JWT_VERIFICATION_ERROR' }))
    }

    const user = await userModel.findOne({ _id: verifyToken.data._id })
    if (!user) {
        throw errorResponder(new AppError({ message: 'User does exist', type: 'ACCOUNT_NOT_FOUND'}))
    }
    
    const getJwtTokens = createAuthTokens({ _id: user._id.toString(), role: 'user' })
    if (isError(getJwtTokens) || !getJwtTokens.data) {
        throw errorResponder(getJwtTokens.error || new AppError({ message: 'Error creating jwt', type: 'JWT_CREATION_ERROR' }))
    }

    logger.info('auth token generated successful', { user: user._id, type: 'REFRESH_TOKEN' })
    return {
        tokens: getJwtTokens.data,
        user: user.toJSON(),
    }
}
