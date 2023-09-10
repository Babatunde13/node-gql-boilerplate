import { strict as assert } from 'node:assert'
import { createAgent, createTestUser } from '../../../../test_utils/create_agent'
import { generateFakeData } from '../../../../test_utils/fake_data'
import gqlBuilder from '../../../../../src/libs/gql_builder'

let agent
describe('register', () => {
    beforeEach(async () => {
        agent = createAgent()
    })

    it('should throw if input is not valid', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'register',
                inputName: 'RegisterInput!',
                fields: 'user { email firstName lastName }'
            }),
            variables: {
                input: {
                    password: 'password',
                    firstName: 'firstName',
                    lastName: 'lastName'
                }
            }
        })

        assert.equal(response.body.errors[0].message.includes('Field "email" of required type "String!" was not provided'), true)
    })

    it('should throw if input validation fails', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'register',
                inputName: 'RegisterInput!',
                fields: 'user { email firstName lastName }'
            }),
            variables: {
                input: {
                    password: 'password',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: 'email'
                }
            }
        })

        assert.equal(response.body.errors[0].message, 'Invalid Input')
        assert.equal(response.body.errors[0].extensions.metadata.email, 'Email must be a valid email address')
        assert.equal(response.body.errors[0].extensions.metadata.password, 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number')
    })

    it('should throw if email is a disposable email', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'register',
                inputName: 'RegisterInput!',
                fields: 'user { email firstName lastName }'
            }),
            variables: {
                input: {
                    password: 'pa#12Ussword',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: 'user@zzz.com'
                }
            }
        })

        assert.equal(response.body.errors[0].message, 'Invalid email')
    })

    it('should throw if email is already taken', async () => {
        const { user } = await createTestUser()
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'register',
                inputName: 'RegisterInput!',
                fields: 'user { email firstName lastName }'
            }),
            variables: {
                input: {
                    password: 'pa#12Ussword',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: user.email
                }
            }
        })

        assert.equal(response.body.errors[0].message, 'Email already exists')
    })

    it('should register a user', async () => {
        const user = {
            email: generateFakeData().user.email,
            password: generateFakeData().user.password,
            firstName: generateFakeData().user.firstName,
            lastName: generateFakeData().user.lastName
        }
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

        const { user: createdUser, tokens } = response.body.data.register
        assert.equal(createdUser.email, user.email.toLowerCase())
        assert.equal(createdUser.firstName, user.firstName)
        assert.equal(createdUser.lastName, user.lastName)
        assert.equal(createdUser.verified, false)
        assert.equal(typeof createdUser._id, 'string')
        assert.equal(typeof createdUser.created, 'string')
        assert.equal(typeof createdUser.updated, 'string')
    
        assert.equal(typeof tokens, 'object')
        assert.equal(typeof tokens.refreshToken.token, 'string')
        assert.equal(typeof tokens.refreshToken.expires, 'string')
        assert.equal(typeof tokens.accessToken.token, 'string')
        assert.equal(typeof tokens.accessToken.expires, 'string')
    })
})
