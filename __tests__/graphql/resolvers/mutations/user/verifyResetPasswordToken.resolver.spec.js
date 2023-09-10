import { strict as assert } from 'node:assert'
import { createAgent, createTestUser } from '../../../../test_utils/create_agent'
import gqlBuilder from '../../../../../src/libs/gql_builder'
import { JwtType, createJwt } from '../../../../../src/libs/jwt'

let agent
describe('verifyResetPassword', () => {
    beforeEach(async () => {
        agent = createAgent()
    })

    it('should throw if input is not valid', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'verifyResetPassword',
                inputName: 'TokenInput!'
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

    it('should verify reset password token', async () => {
        const { user } = await createTestUser()
        const { data: token } = createJwt({ _id: user._id, role: 'user', type: JwtType.RESET_PASSWORD})
    
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'verifyResetPassword',
                inputName: 'TokenInput!'
            }),
            variables: {
                input: {
                    token
                }
            }
        })

        const res = response.body.data.verifyResetPassword
        assert.equal(res, true)
    })
})
