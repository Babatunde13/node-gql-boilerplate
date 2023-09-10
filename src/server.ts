import 'reflect-metadata'
import express from 'express'
import http from 'http'
import { AppDBConnection } from './config/app_db_connection'
import createGraphQLServer from './graphql_server'
import logger from './libs/logger'
import isError from './libs/is_error'

interface Config {
    port: number
    db: AppDBConnection
}


const corsConfig = {
    // Methods we allow
    methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
    // Allows all header
    headers: '*',
    // Allow requests from all domains
    origins: '*', // Allows all origins
}

export default async function startServer(config: Config) {
    const connect = await config.db.connect()
    if (isError(connect) || !connect.data) {
        logger.error('Error connecting to database', connect.error)
    }
    const app = express()
    app.use(express.json())
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', corsConfig.origins)
        res.header('Access-Control-Allow-Headers', corsConfig.headers)
        if (req.method === 'OPTIONS') {
            // preflight request
            res.header('Access-Control-Allow-Methods', corsConfig.methods)
            return res.status(200).json({})
        }

        next()
        return
    })
    app.get('/', (req, res) => {
        logger.info('Welcome to api')
        res.send('Welcome to api')
    })
    const gqlServer = await createGraphQLServer(app)
    const httpServer = http.createServer(app)

    httpServer.listen({ port: config.port }, () => {
        logger.info(`🚀 Server ready at http://localhost:${config.port}`)
        logger.info(`🚀 GraphQL ready at http://localhost:${config.port}${gqlServer.graphqlPath}`)
    })

    return httpServer
}
