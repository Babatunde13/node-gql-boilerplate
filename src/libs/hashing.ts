import bcrypt from 'bcrypt'
import AppError from './error'

export const generateHash = async (text: string) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(text, salt)
        return {
            data: hash
        }
    } catch (err) {
        const error = new AppError({
            message: 'Error generating hash',
            type: 'HASH_GENERATION_ERROR',
            metadata: {
                error: (err as Error).message
            }
        })
        return { error }
    }
}

export const compareHash = async (text: string, hash: string) => {
    try {
        const isValid = await bcrypt.compare(text, hash)
        return {
            data: isValid
        }
    } catch (err) {
        const error = new AppError({
            message: 'Error comparing hash',
            type: 'HASH_COMPARISON_ERROR',
            metadata: {
                error: (err as Error).message
            }
        })
        return { error }
    }
}
