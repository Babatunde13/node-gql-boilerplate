import { strict as assert } from 'node:assert'
import { createAgent, createTestUser } from '../../../../test_utils/create_agent'
import gql_builder from '../../../../../src/libs/gql_builder'

let agent
describe('loggedIn', () => {
    beforeEach(async () => {
        agent = createAgent()
    })

    it('should throw unauthorized if token is not set', async () => {
        const response = await agent.post('/graphql').send({
            query: gql_builder.generateQuery({
                queryName: 'loggedIn',
                fields: '_id email firstName lastName created updated'
            })
        })

        assert.equal(response.body.errors[0].message, 'Unauthorized')
    })

    it('should throw unauthorized if token is not valid', async () => {
        const response = await agent.post('/graphql')
            .set('Authorization', 'Bearer invalid_token')
            .send({
                query: gql_builder.generateQuery({
                    queryName: 'loggedIn',
                    fields: '_id email firstName lastName created updated'
                })
            })

        assert.equal(response.body.errors[0].message, 'Unauthorized')
    })

    it('should return user object', async () => {
        const { user, agent: agent1 } = await createTestUser()
        const response = await agent1.post('/graphql')
            .send({
                query: gql_builder.generateQuery({
                    queryName: 'loggedIn',
                    fields: '_id email firstName lastName created updated'
                })
            })

        const createdUser = response.body.data.loggedIn
        assert.equal(createdUser.email, user.email)
        assert.equal(createdUser.firstName, user.firstName)
        assert.equal(createdUser.lastName, user.lastName)
        assert.equal(createdUser._id, user._id.toString())
        assert.equal(createdUser.updated, user.updated)
        assert.equal(createdUser.created, user.updated)
    })
})
