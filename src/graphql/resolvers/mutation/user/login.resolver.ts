import { MutationLoginArgs, AuthOutput, LoginInput } from '../../../../../generated/graphql'
import errorResponder from '../../../../libs/error_responder'
import AppError from '../../../../libs/error'
import { compareHash } from '../../../../libs/hashing'
import isError from '../../../../libs/is_error'
import { createAuthTokens } from '../../../../libs/jwt'
import logger from '../../../../libs/logger'
import { isValidEmail, isValidPassword } from '../../../../libs/validations/validate_scalars'
import userModel from '../../../../models/user.model'
import { ParentType } from '../../../../types/base_req.types'

const validateLoginInput = (loginInput: LoginInput) => {
    const errors: { [key: string]: string } = {}

    if (loginInput.password === '' || !isValidPassword(loginInput.password)) {
        errors.password = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number'
    }

    if (loginInput.email === '' || !isValidEmail(loginInput.email)) {
        errors.email = 'Email must be a valid email address'
    }
    
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}


export default async function loginResolver (_: ParentType, { input }: MutationLoginArgs): Promise<AuthOutput> {
    const validateInput = validateLoginInput(input)
    if (!validateInput.valid) {
        const error = new AppError({ message: 'Invalid Input', type: 'VALIDATION_ERROR', metadata: validateInput.errors })
        throw errorResponder(error)
    }
    const user = await userModel.findOne({ email: input.email })
    if (!user) {
        throw errorResponder(new AppError({ message: 'Invalid email or password', type: 'ACCOUNT_NOT_FOUND'}))
    }

    const comparePassword = await compareHash(input.password, user.password)
    if (isError(comparePassword) || !comparePassword.data) {
        throw errorResponder(new AppError({ message: 'Invalid email or password', type: 'PASSWORD_COMPARISON_ERROR' }))
    }

    const getJwtTokens = createAuthTokens({ _id: user._id.toString(), role: 'user' })
    if (isError(getJwtTokens) || !getJwtTokens.data) {
        throw errorResponder(getJwtTokens.error || new AppError({ message: 'Error creating jwt', type: 'JWT_CREATION_ERROR' }))
    }
    logger.info('sign in successful', { user: user._id, type: 'SIGN_IN' })
    return {
        tokens: getJwtTokens.data,
        user: user.toJSON(),
    }
}
