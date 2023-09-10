import { IncomingHttpHeaders } from 'http'
import { Context } from '../types/base_req.types'
import { verifyJwt } from './jwt'
import userModel from '../models/user.model'


export const getUserContextDataFromHeaders = async (headers?: IncomingHttpHeaders): Promise<Context> => {
    if (!headers) {
        return {}
    }
    const authHeader = headers.authorization || ' '

    const token = authHeader.split(' ')[1]

    if (!token) {
        return {}
    }

    const tokenDataResponse = verifyJwt(token)
    const role = tokenDataResponse.data?.role

    if (role === 'user') {
        const user = await userModel.findOne({ _id: tokenDataResponse.data?._id })
        if (!user) {
            return {}
        }

        return {
            user
        }
    }
    
    return {}
}
