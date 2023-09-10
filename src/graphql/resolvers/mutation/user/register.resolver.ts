import { MutationRegisterArgs, AuthOutput, RegisterInput } from '../../../../../generated/graphql'
import { sendMail } from '../../../../emails/send_email'
import welcomeMailTemplate from '../../../../emails/templates/welcome.template'
import errorResponder from '../../../../libs/error_responder'
import AppErrorr from '../../../../libs/error'
import AppError from '../../../../libs/is_error'
import disposable_emails from '../../../../libs/disposable_emails'
import { JwtType, createAuthTokens, createJwt } from '../../../../libs/jwt'
import logger from '../../../../libs/logger'
import { isValidEmail, isValidPassword } from '../../../../libs/validations/validate_scalars'
import userModel, { IUser, createNewUser } from '../../../../models/user.model'
import { ParentType } from '../../../../types/base_req.types'

const validateRegisterInput = (registerInput: RegisterInput) => {
    const errors: { [key: string]: string } = {}

    if (registerInput.firstName.trim() === '' || registerInput.firstName.trim().length < 2) {
        errors.firstName = 'First name must not be empty'
    }

    if (registerInput.lastName.trim() === '' || registerInput.lastName.trim().length < 2) {
        errors.lastName = 'Last name must not be empty'
    }

    if (registerInput.password === '' || !isValidPassword(registerInput.password)) {
        errors.password = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number'
    }

    if (registerInput.email === '' || !isValidEmail(registerInput.email)) {
        errors.email = 'Email must be a valid email address'
    }
    
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

const sendWelcomeMail = async (user: IUser, token: string) => {
    const mailContent = welcomeMailTemplate(`${user.firstName} ${user.lastName}`, token)
    await sendMail({
        email: user.email,
        subject: `Verify your email, ${user.firstName}!`,
        content: mailContent,
    })
}

export default async function registerResolver (_: ParentType, { input }: MutationRegisterArgs): Promise<AuthOutput> {
    const validateInput = validateRegisterInput(input)
    if (!validateInput.valid) {
        const error = new AppErrorr({ message: 'Invalid Input', type: 'VALIDATION_ERROR', metadata: validateInput.errors })
        throw errorResponder(error)
    }

    const isDisposableEmail = disposable_emails.includes(input.email.split('@')[1])
    if (isDisposableEmail) {
        throw errorResponder(new AppErrorr({ message: 'Invalid email', type: 'DISPOSABLE_EMAIL',  metadata: { email: input.email } }))
    }

    const emailExists = await userModel.findOne({ email: input.email })
    if (emailExists) {
        throw errorResponder(new AppErrorr({ message: 'Email already exists', type: 'EMAIL_EXISTS' }))
    }

    const createUser = await createNewUser(input)
    if (AppError(createUser) || !createUser.data) {
        throw errorResponder(createUser.error || new AppErrorr({ message: 'Error creating user', type: 'USER_CREATION_ERROR' }))
    }

    const user = createUser.data
    const getJwtTokens = createAuthTokens({ _id: user._id.toString(), role: 'user' })
    if (AppError(getJwtTokens) || !getJwtTokens.data) {
        await user.deleteOne()
        throw errorResponder(getJwtTokens.error || new AppErrorr({ message: 'Error creating jwt', type: 'JWT_CREATION_ERROR' }))
    }

    const verifyAccountToken = createJwt({ _id: user._id.toString(), role: 'user', type: JwtType.VERIFY_ACCOUNT },{ expiresIn: '1d' })
    if (AppError(verifyAccountToken) || !verifyAccountToken.data) {
        await user.deleteOne()
        throw errorResponder(verifyAccountToken.error || new AppErrorr({ message: 'Error creating jwt', type: 'JWT_CREATION_ERROR' }))
    }

    await sendWelcomeMail(user, verifyAccountToken.data)
    logger.info('sign up successful', { user: user._id, type: 'SIGN_UP' })
    return {
        tokens: getJwtTokens.data,
        user: user.toJSON(),
    }
}
