import { MutationForgotPasswordArgs } from '../../../../../generated/graphql'
import { sendMail } from '../../../../emails/send_email'
import { forgotPasswordMailTemplate } from '../../../../emails/templates/forgot_password.template'
import errorResponder from '../../../../libs/error_responder'
import AppError from '../../../../libs/error'
import isError from '../../../../libs/is_error'
import { JwtType, createJwt } from '../../../../libs/jwt'
import logger from '../../../../libs/logger'
import { isValidEmail } from '../../../../libs/validations/validate_scalars'
import userModel, { IUser } from '../../../../models/user.model'
import { ParentType } from '../../../../types/base_req.types'

const sendForgotPasswordMail = async (user: IUser, token: string) => {
    const mailContent = forgotPasswordMailTemplate(user.firstName, token)
    await sendMail({
        email: user.email,
        subject: 'Reset Your Password',
        content: mailContent,
    })
}

export default async function forgotPasswordResolver (_: ParentType, { input }: MutationForgotPasswordArgs): Promise<boolean> {
    const validateInput = isValidEmail(input.email)
    if (!validateInput) {
        const error = new AppError(
            { message: 'Invalid Input', type: 'VALIDATION_ERROR', metadata: { email: 'Invalid email' } }
        )
        throw  errorResponder(error)
    }
    const user = await userModel.findOne({ email: input.email })
    if (!user) {
        throw errorResponder(new AppError({ message: 'User does exist', type: 'ACCOUNT_NOT_FOUND'}))
    }

    const getJwtToken = createJwt(
        { _id: user._id.toString(), role: 'user', type: JwtType.RESET_PASSWORD },
        { expiresIn: '1h' }
    )
    if (isError(getJwtToken) || !getJwtToken.data) {
        throw errorResponder(getJwtToken.error || new AppError(
            { message: 'Error creating reset password token', type: 'JWT_CREATION_ERROR' }
        ))
    }

    await sendForgotPasswordMail(user, getJwtToken.data)
    logger.info('reset password link sent', { user: user._id, type: 'RESET_PASSWORD' })
    return true
}
