import supertest from 'supertest'
import { AuthOutput, User } from '../../generated/graphql'
import envs from '../../src/config/envs'
import gqlBuilder from '../../src/libs/gql_builder'
import { generateFakeData } from './fake_data'
import { IUser } from '../../src/models/user.model'

export const createAgent = (host?: string) => {
    const agent = supertest.agent(host || `http://localhost:${envs.port}`)
    agent.set('Content-Type', 'application/json')

    return agent
}

export const createTestUser = async (host?: string, options?: IUser) => {
    const fakeData = generateFakeData()
    const user = {
        email: options?.email || fakeData.user.email,
        password: options?.password || fakeData.user.password,
        firstName: options?.firstName || fakeData.user.firstName,
        lastName: options?.lastName || fakeData.user.lastName
    }
    const agent = createAgent(host)
    const response = await agent.post('/graphql').send({
        query: gqlBuilder.generateMutation({
            mutationName: 'register',
            inputName: 'RegisterInput!',
            fields: 'tokens { accessToken { token expires } refreshToken { token expires } } user { _id email firstName lastName created updated verified }'
        }),
        variables: {
            input: user
        }
    })

    const { tokens, user: createdUser }: AuthOutput = response.body.data.register
    if (createdUser) {
        (createdUser as User & { password: string }).password = user.password
    }
    agent.set('Authorization', `Bearer ${tokens?.accessToken.token}`)
    return { user: createdUser, agent, tokens }
}
