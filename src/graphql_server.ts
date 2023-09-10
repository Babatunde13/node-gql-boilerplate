import { ApolloServer } from 'apollo-server-express'
import { Application } from 'express'
import typeDefs from './graphql/schema'
import envs from './config/envs'
import resolvers from './graphql/resolvers'
import { getUserContextDataFromHeaders } from './libs/get_user_context_from_header'
import { Application as GQLApplication } from './types/base_req.types'

export default async function createGraphQLServer (app: Application) {
    const server = new ApolloServer<GQLApplication>({
        typeDefs,
        resolvers,
        context: ({ req }) => getUserContextDataFromHeaders(req.headers),
        introspection: envs.apollo.introspection,
    })

    await server.start()
    server.applyMiddleware({ app })

    return server
}
