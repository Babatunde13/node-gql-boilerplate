import { strict as assert } from 'node:assert'
import { createAgent, createTestUser } from '../../../../test_utils/create_agent'
import gqlBuilder from '../../../../../src/libs/gql_builder'
import { JwtType, createJwt } from '../../../../../src/libs/jwt'

let agent
describe('refreshAccessToken', () => {
    beforeEach(async () => {
        agent = createAgent()
    })
    
    it('should throw if input is not valid', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'refreshAccessToken',
                inputName: 'TokenInput!',
                fields: 'user { _id email firstName lastName created updated } tokens { refreshToken { token expires } accessToken { token expires } }'
            }),
            variables: {
                input: {
                    token: 'token',
                }
            }
        })


        assert.equal(response.body.errors[0].message, 'Invalid Input')
        assert.equal(response.body.errors[0].extensions.metadata.token, 'Invalid token')
    })

    it('should throw if user is not found', async () => {
        const { data: token } = createJwt({ _id: 'randomid', role: 'user', type: JwtType.REFRESH})
    
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'refreshAccessToken',
                inputName: 'TokenInput!',
                fields: 'user { _id email firstName lastName created updated } tokens { refreshToken { token expires } accessToken { token expires } }'
            }),
            variables: {
                input: {
                    token
                }
            }
        })

        assert.equal(response.body.errors[0].message, 'Invalid token')

    })

    it('should throw if token is not a refresh token', async () => {
        const { tokens } = await createTestUser()
    
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'refreshAccessToken',
                inputName: 'TokenInput!',
                fields: 'user { _id email firstName lastName created updated } tokens { refreshToken { token expires } accessToken { token expires } }'
            }),
            variables: {
                input: {
                    token: tokens.accessToken.token
                }
            }
        })

        assert.equal(response.body.errors[0].message, 'Invalid token')
    })

    it('should refresh access token', async () => {
        const { user, tokens: token } = await createTestUser()
    
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'refreshAccessToken',
                inputName: 'TokenInput!',
                fields: 'user { _id email firstName lastName created updated } tokens { refreshToken { token expires } accessToken { token expires } }'
            }),
            variables: {
                input: {
                    token: token.refreshToken.token
                }
            }
        })

        const { user: createdUser, tokens } = response.body.data.refreshAccessToken
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
