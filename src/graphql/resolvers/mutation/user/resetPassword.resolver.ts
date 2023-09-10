import { MutationResetPasswordArgs, ResetPasswordInput } from '../../../../../generated/graphql'
import errorResponder from '../../../../libs/error_responder'
import AppError from '../../../../libs/error'
import isError from '../../../../libs/is_error'
import { JwtType, verifyJwt } from '../../../../libs/jwt'
import logger from '../../../../libs/logger'
import { isValidJwtToken, isValidPassword } from '../../../../libs/validations/validate_scalars'
import { resetPasswordMailTemplate } from '../../../../emails/templates/forgot_password.template'
import userModel, { IUser } from '../../../../models/user.model'
import { ParentType } from '../../../../types/base_req.types'
import { sendMail } from '../../../../emails/send_email'
import { generateHash } from '../../../../libs/hashing'

const  validateResetPasswordInput = (resetPasswordInput: ResetPasswordInput) => {
    const errors: { [key: string]: string } = {}

    if (resetPasswordInput.password === '' || !isValidPassword(resetPasswordInput.password)) {
        errors.password = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number'
    }

    if (resetPasswordInput.token === '' || !isValidJwtToken(resetPasswordInput.token)) {
        errors.token = 'Invalid token'
    }
    
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

const sendResetPasswordMail = async (user: IUser) => {
    const mailContent = resetPasswordMailTemplate(user.firstName)
    await sendMail({
        email: user.email,
        subject: 'Password reset successful',
        content: mailContent,
    })
}

export default async function resetPasswordResolver (_: ParentType, { input }: MutationResetPasswordArgs): Promise<boolean> {
    const validateInput = validateResetPasswordInput(input)
    if (!validateInput.valid) {
        throw errorResponder(
            new AppError({ message: 'Invalid Input', type: 'VALIDATION_ERROR', metadata: validateInput.errors })
        )
    }

    const verifyToken = verifyJwt(input.token, JwtType.RESET_PASSWORD)
    if (isError(verifyToken) || !verifyToken.data) {
        throw errorResponder(
            verifyToken.error || new AppError({ message: 'Error creating reset password token', type: 'JWT_CREATION_ERROR' })
        )
    }

    const passwordResult = await generateHash(input.password)
    if (isError(passwordResult)) {
        throw errorResponder(
            passwordResult.error || new AppError({ message: 'Error creating password hash', type: 'PASSWORD_HASH_ERROR' })
        )
    }

    const user = await userModel.findOneAndUpdate({ _id: verifyToken.data._id }, { password: passwordResult.data })
    if (!user) {
        throw errorResponder(new AppError({ message: 'User does exist', type: 'ACCOUNT_NOT_FOUND'}))
    }

    await sendResetPasswordMail(user)
    logger.info('password reset successful', { user: user._id, type: 'PASSWORD_RESET' })
    return true
}
