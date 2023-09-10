import { Types } from 'mongoose'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export const isValidEmail = (email: string) => {
    if (!email) {
        return false
    }

    return emailRegex.test(email)
}

export const isValidPassword = (password: string) => {
    if (!password) {
        return false
    }

    return passwordRegex.test(password)
}

export const isValidObjectId = (id: string) => {
    return Types.ObjectId.isValid(id)
}

export const isValidJwtToken = (token: string) => {
    return token.split('.').length === 3
}
