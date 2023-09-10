import { User } from '../../../../../generated/graphql'
import { ensureAuthorized } from '../../../../libs/ensure_authorized'
import logger from '../../../../libs/logger'
import { AuthContext, ParentType } from '../../../../types/base_req.types'

export const loggedInResolver = async (_: ParentType, __: unknown, context: AuthContext): Promise<User> => {
    ensureAuthorized(context)
    
    logger.info('User fetched', { user: context.user._id, type: 'LOGGED_IN' })
    return  context.user.toJSON()
}
