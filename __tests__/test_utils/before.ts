import http from 'http'
import { AppDBConnection } from '../../src/config/app_db_connection'
import envs from '../../src/config/envs'
import logger from '../../src/libs/logger'
import startServer from '../../src/server'

let server: http.Server
let dbConnection: AppDBConnection

before(async () => {
    dbConnection = new AppDBConnection(envs.database.url)
    const config = {
        port: envs.port,
        db: dbConnection
    }
    server = await startServer(config)
    logger.info('Test Server started')
})

after(async () => {
    server?.close()
    logger.info('Test Server stopped')
    if (dbConnection?.client) {
        await dbConnection.drop()
        await dbConnection.disconnect()
    }
})
