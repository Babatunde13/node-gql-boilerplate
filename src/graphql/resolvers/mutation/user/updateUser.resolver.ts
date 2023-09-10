import { ensureAuthorized } from '../../../../libs/ensure_authorized'
import { MutationUpdateUserArgs, User } from '../../../../../generated/graphql'
import errorResponder from '../../../../libs/error_responder'
import AppError from '../../../../libs/error'
import logger from '../../../../libs/logger'
import userModel, { UserClient } from '../../../../models/user.model'
import { AuthContext, ParentType } from '../../../../types/base_req.types'
import capitalizeWord from '../../../../libs/capitalize_word'

export default async function updateUserResolver (_: ParentType, { input }: MutationUpdateUserArgs, context: AuthContext): Promise<User> {
    ensureAuthorized(context)
    const update: Partial<UserClient> = {}
    if (input.firstName && input.firstName.trim() !== '' && input.firstName.length > 1) {
        update.firstName = capitalizeWord(input.firstName)
    }

    if (input.lastName && input.lastName.trim() !== '' && input.lastName.length > 1) {
        update.lastName = capitalizeWord(input.lastName)
    }

    if (input.username) {
        const usernameExists = await userModel.findOne({ username: input.username })
        if (usernameExists) {
            errorResponder(new AppError({ message: 'Username already exists', type: 'USERNAME_EXISTS' }))
        }
        update.username = input.username
    }

    if (input.picture) {
        update.picture = input.picture
    }
    const user = await userModel.findOneAndUpdate({ _id: context.user._id }, { $set: update }, { new: true })
    if (!user) {
        throw errorResponder(new AppError({ message: 'User not found', type: 'USER_NOT_FOUND' }))
    }

    logger.info('User updated', { user: user._id, type: 'UPDATE_USER' })
    return user.toJSON()
}
