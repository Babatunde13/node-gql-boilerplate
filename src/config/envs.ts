import 'dotenv/config'

const getDatabaseUrl = () => {
    const env = process.env.NODE_ENV || 'development'
    switch (env) {
    case 'test':
        return process.env.TEST_DATABASE_URL || 'mongodb://127.0.0.1:27017/node-gql-boilerplate-test'
    case 'production':
        return process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/node-gql-boilerplate'
    default:
        return process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/node-gql-boilerplate'
    }
}

const NODE_ENV = process.env.NODE_ENV || 'development'

const envs = {
    port: parseInt(process.env.PORT|| '4000'),
    env: NODE_ENV,
    database: {
        url: getDatabaseUrl(),
    },
    secrets: {
        jwt: process.env.JWT_SECRET || 'secret'
    },
    hosts: {
        client: process.env.CLIENT_HOST || 'http://localhost:3000',
        server: process.env.SERVER_HOST || 'http://localhost:4000'
    },
    mail: {
        apiKey: process.env.MAILGUN_API_KEY || '',
        domain: process.env.MAILGUN_DOMAIN || '',
        from: process.env.MAILGUN_FROM || '',
    },
    apollo: {
        introspection: process.env.NODE_ENV !== 'production',
    },
    isProd: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test'
}

export default envs
