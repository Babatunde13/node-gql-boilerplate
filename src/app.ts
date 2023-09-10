import { AppDBConnection } from './config/app_db_connection'
import envs from './config/envs'
import startServer from './server'

const main = async () => {
    const dbConnection = new AppDBConnection(envs.database.url)
    const config = {
        port: envs.port,
        db: dbConnection
    }
    await startServer(config)
}

main()

