import { QueryResolvers } from '../../../../generated/graphql'
import { loggedInResolver } from './user/loggedIn.resolver'

const queries: QueryResolvers = {
    loggedIn: loggedInResolver
}

export default queries
