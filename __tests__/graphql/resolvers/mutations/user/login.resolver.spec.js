import { strict as assert } from 'node:assert'
import { createAgent, createTestUser } from '../../../../test_utils/create_agent'
import gqlBuilder from '../../../../../src/libs/gql_builder'

let agent
describe('login', () => {
    beforeEach(async () => {
        agent = createAgent()
    })

    it('should throw if input is not valid', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'login',
                inputName: 'LoginInput!',
                fields: 'user { email firstName lastName }'
            }),
            variables: {
                input: {
                    password: 'password',
                    email: 'email',
                }
            }
        })


        assert.equal(response.body.errors[0].message, 'Invalid Input')
        assert.equal(response.body.errors[0].extensions.metadata.email, 'Email must be a valid email address')
        assert.equal(response.body.errors[0].extensions.metadata.password, 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number')
    })

    it('should throw if user is not found', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'login',
                inputName: 'LoginInput!',
                fields: 'user { email firstName lastName }'
            }),
            variables: {
                input: {
                    password: 'Pass@3djdFJR',
                    email: 'user@gmail.com',
                }
            }
        })


        assert.equal(response.body.errors[0].message, 'Invalid email or password')
    })

    it('should throw if password is not correct', async () => {
        const { agent: a, user } = await createTestUser()
        const response = await a.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'login',
                inputName: 'LoginInput!',
                fields: 'user { email firstName lastName }'
            }),
            variables: {
                input: {
                    password: 'Pass@3djdFJR',
                    email: user.email
                }
            }
        })


        assert.equal(response.body.errors[0].message, 'Invalid email or password')
    })

    it('should login a user', async () => {
        const { user } = await createTestUser()
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'login',
                inputName: 'LoginInput!',
                fields: 'tokens { accessToken { token expires } refreshToken { token expires } } user { _id email firstName lastName created updated }'
            }),
            variables: {
                input: {
                    email: user.email,
                    password: user.password
                }
            }
        })

        const { user: createdUser, tokens } = response.body.data.login
        assert.equal(createdUser.email, user.email.toLowerCase())
        assert.equal(createdUser.firstName, user.firstName)
        assert.equal(createdUser.lastName, user.lastName)
        assert.deepEqual(createdUser._id, user._id)
        assert.deepEqual(createdUser.created, user.created)
        assert.deepEqual(createdUser.updated, user.updated)
        
        assert.equal(typeof tokens, 'object')
        assert.equal(typeof tokens.refreshToken.token, 'string')
        assert.equal(typeof tokens.refreshToken.expires, 'string')
        assert.equal(typeof tokens.accessToken.token, 'string')
        assert.equal(typeof tokens.accessToken.expires, 'string')
    })
})
