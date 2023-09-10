import { UserProvider } from '../../generated/graphql'
import { generateHash } from '../libs/hashing'
import mongoose, { Schema } from 'mongoose'
import { BaseModelClient, BaseModelServer } from './base.model'
import AppError from '../libs/error'
import { DataOrError } from '../libs/data_or_error'
import capitalizeWord from '../libs/capitalize_word'
import isError from '../libs/is_error'

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    picture: { type: String, required: false },
    password: { type: String, required: false },
    stripe_userid: { type: String, required: false },
    username: { type: String, required: true, unique: true, index: true },
    verified: { type: Boolean, default: false },
    provider: { type: String, enum: Object.values(UserProvider), default: UserProvider.Local },
    active: { type: Boolean, default: true, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

userSchema.pre<IUser>('save', async function (next) {
    this.email = this.email.toLowerCase()
    this.firstName = this.firstName.trim()
    this.lastName = this.lastName.trim()

    this.firstName = capitalizeWord(this.firstName)
    this.lastName = capitalizeWord(this.lastName)

    return next()
})

userSchema.methods.toJSON = function (): UserClient {
    const user = this as IUser
    return {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: getProfilePicture(user),
        verified: user.verified,
        username: user.username,
        provider: user.provider,
        metadata: user.metadata,
        active: user.active,
        created: user.created.toISOString(),
        updated: user.updated.toISOString(),
    }
}

async function getDefaultUsernameForUser(email: string) {
    // generate a username for this user
    let username = email.split('@')[0]

    let usernameExists = true
 
    while (usernameExists) {
        const findUsername = await userModel.findOne({ username })
 
        if (findUsername) {
            // Count documents that match this username
            const matchedUsernameCount = await userModel.count({ username })
            username = `${username}${matchedUsernameCount! + 1}`
        } else {
            usernameExists = false
        }
    }
 
    return username
}

const userModel = mongoose.model('User', userSchema)

export function getProfilePicture(user: IUser) {
    let picture = ''
    if (user.picture) {
        picture = user.picture
    } else {
        picture = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff&size=128`
    }

    return picture
}

export const createNewUser = async (input: Omit<Partial<IUser>, 'username'> & Pick<UserClient, 'email'>): Promise<DataOrError<IUser>> => {
    const passwordResult = await generateHash(input.password || 'default')
    if (isError(passwordResult)) {
        return { error: passwordResult.error || new AppError({ message: 'Error creating password hash', type: 'PASSWORD_HASH_ERROR' }) }
    }
    try {
        const username = await getDefaultUsernameForUser(input.email)
        const newUser = new userModel({
            ...input,
            username,
            password: passwordResult.data,
        })

        await newUser.save()

        return { data: newUser }
    } catch (error) {
        return { error: new AppError({ message: 'Error creating user', type: 'USER_CREATION_ERROR', metadata: { error } }) }
    }
}

export interface IUser extends BaseModelServer {
    email: string
    firstName: string
    lastName: string
    username: string
    picture?: string
    password: string
    stripe_userid: string
    verified: boolean
    provider: UserProvider
}

export interface UserClient extends BaseModelClient {
    email: string
    firstName: string
    lastName: string
    username: string
    picture?: string
    verified: boolean
    provider: UserProvider
}

export default userModel
