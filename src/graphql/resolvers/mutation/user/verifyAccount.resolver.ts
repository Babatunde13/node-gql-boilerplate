import {  MutationVerifyAccountArgs, TokenInput } from '../../../../../generated/graphql'
import errorResponder from '../../../../libs/error_responder'
import AppError from '../../../../libs/error'
import isError from '../../../../libs/is_error'
import { JwtType, verifyJwt } from '../../../../libs/jwt'
import logger from '../../../../libs/logger'
import { isValidJwtToken } from '../../../../libs/validations/validate_scalars'
import userModel from '../../../../models/user.model'
import { ParentType } from '../../../../types/base_req.types'

const  validateVerifyAccountInput = (tokenInput: TokenInput) => {
    const errors: { [key: string]: string } = {}

    if (tokenInput.token === '' || !isValidJwtToken(tokenInput.token)) {
        errors.token = 'Invalid token'
    }
    
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

export default async function verifyAccountResolver (_: ParentType, { input }: MutationVerifyAccountArgs): Promise<boolean> {
    const validateInput = validateVerifyAccountInput(input)
    if (!validateInput.valid) {
        const error = new AppError({ message: 'Invalid Input', type: 'VALIDATION_ERROR', metadata: validateInput.errors })
        throw errorResponder(error)
    }

    const verifyToken = verifyJwt(input.token, JwtType.VERIFY_ACCOUNT)
    if (isError(verifyToken) || !verifyToken.data) {
        throw errorResponder(verifyToken.error || new AppError({ message: 'Error verifying verify account token', type: 'JWT_ERROR' }))
    }

    const user = await userModel.findOneAndUpdate({ _id: verifyToken.data._id }, { $set: { verified: true } })
    if (!user) {
        throw errorResponder(new AppError({ message: 'User does exist', type: 'ACCOUNT_NOT_FOUND'}))
    }

    logger.info('account verified successful', { user: user._id, type: 'ACCOUNT_VERIFICATION' })
    return true
}
