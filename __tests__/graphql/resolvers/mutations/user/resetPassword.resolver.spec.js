import { strict as assert } from 'node:assert'
import { createAgent, createTestUser } from '../../../../test_utils/create_agent'
import gqlBuilder from '../../../../../src/libs/gql_builder'
import { JwtType, createJwt } from '../../../../../src/libs/jwt'

let agent
describe('resetPassword', () => {
    beforeEach(async () => {
        agent = createAgent()
    })

    it('should throw if input is not valid', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'resetPassword',
                inputName: 'ResetPasswordInput!'
            }),
            variables: {
                input: {
                    password: 'password',
                    token: 'token',
                }
            }
        })


        assert.equal(response.body.errors[0].message, 'Invalid Input')
        assert.equal(response.body.errors[0].extensions.metadata.token, 'Invalid token')
        assert.equal(response.body.errors[0].extensions.metadata.password, 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number')
    })

    it('should reset user password', async () => {
        const { user } = await createTestUser()
        const { data: token } = createJwt({ _id: user._id, role: 'user', type: JwtType.RESET_PASSWORD})

        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'resetPassword',
                inputName: 'ResetPasswordInput!'
            }),
            variables: {
                input: {
                    token,
                    password: user.password
                }
            }
        })

        const res = response.body.data.resetPassword
        assert.equal(res, true)
    })
})
