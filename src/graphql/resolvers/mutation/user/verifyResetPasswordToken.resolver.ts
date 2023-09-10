import { MutationVerifyResetPasswordArgs } from '../../../../../generated/graphql'
import errorResponder from '../../../../libs/error_responder'
import AppError from '../../../../libs/error'
import isError from '../../../../libs/is_error'
import { JwtType, verifyJwt } from '../../../../libs/jwt'
import logger from '../../../../libs/logger'
import { isValidJwtToken } from '../../../../libs/validations/validate_scalars'
import { ParentType } from '../../../../types/base_req.types'

export default async function verifyResetPasswordTokenResolver (_: ParentType, { input }: MutationVerifyResetPasswordArgs): Promise<boolean> {
    const validateInput = isValidJwtToken(input.token)
    if (!validateInput) {
        const error = new AppError({ message: 'Invalid Input', type: 'VALIDATION_ERROR', metadata: { token: 'Invalid token' } })
        throw errorResponder(error)
    }

    const verifyToken = verifyJwt(input.token, JwtType.RESET_PASSWORD)
    if (isError(verifyToken) || !verifyToken.data) {
        throw errorResponder(verifyToken.error || new AppError({ message: 'Error creating reset password token', type: 'JWT_CREATION_ERROR' }))
    }
    
    logger.info('password reset link verification successful', { user: verifyToken.data._id, type: 'VERIFY_PASSWORD_RESET' })
    return true
}
