import { strict as assert } from 'node:assert'
import { createAgent, createTestUser } from '../../../../test_utils/create_agent'
import gqlBuilder from '../../../../../src/libs/gql_builder'

let agent
describe('forgotPassword', () => {
    beforeEach(async () => {
        agent = createAgent()
    })

    it('should throw if input is not valid', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'forgotPassword',
                inputName: 'ForgotPasswordInput!'
            }),
            variables: {
                input: {
                    email: 'email',
                }
            }
        })


        assert.equal(response.body.errors[0].message, 'Invalid Input')
        assert.equal(response.body.errors[0].extensions.metadata.email, 'Invalid email')
    })

    it('should throw if user is not found', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'forgotPassword',
                inputName: 'ForgotPasswordInput!'
            }),
            variables: {
                input: {
                    email: 'user@gmail.com',
                }
            }
        })


        assert.equal(response.body.errors[0].message, 'User does exist')
    })

    it('should send forget password link to user', async () => {
        const { user } = await createTestUser()
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'forgotPassword',
                inputName: 'ForgotPasswordInput!'
            }),
            variables: {
                input: {
                    email: user.email
                }
            }
        })

        const res = response.body.data.forgotPassword
        assert.equal(res, true)
    })
})
