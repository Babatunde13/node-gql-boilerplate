import { strict as assert } from 'node:assert'
import { createAgent, createTestUser } from '../../../../test_utils/create_agent'
import gqlBuilder from '../../../../../src/libs/gql_builder'
import { JwtType, createJwt } from '../../../../../src/libs/jwt'
import userModel from '../../../../../src/models/user.model'

let agent
describe('verifyAccount', () => {
    beforeEach(async () => {
        agent = createAgent()
    })
    
    it('should throw if input is not valid', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'verifyAccount',
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

    it('should throw if user is not found', async () => {
        const { data: token } = createJwt({ _id: 'randomid', role: 'user', type: JwtType.REFRESH})
    
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'verifyAccount',
                inputName: 'TokenInput!'
            }),
            variables: {
                input: {
                    token
                }
            }
        })

        assert.equal(response.body.errors[0].message, 'Invalid token')

    })

    it('should throw if token is not a verify account token', async () => {
        const { tokens } = await createTestUser()
    
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'verifyAccount',
                inputName: 'TokenInput!'
            }),
            variables: {
                input: {
                    token: tokens.accessToken.token
                }
            }
        })

        assert.equal(response.body.errors[0].message, 'Invalid token')
    })

    it('should verify account', async () => {
        const { user } = await createTestUser()
        const { data: token } = createJwt({ _id: user._id, role: 'user', type: JwtType.VERIFY_ACCOUNT})
    
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'verifyAccount',
                inputName: 'TokenInput!'
            }),
            variables: {
                input: {
                    token
                }
            }
        })

        assert.equal(response.body.data.verifyAccount, true)
        assert.equal(user.verified, false)

        const updatedUser= await userModel.findById(user._id)
        assert.equal(updatedUser.verified, true)
    })
})
