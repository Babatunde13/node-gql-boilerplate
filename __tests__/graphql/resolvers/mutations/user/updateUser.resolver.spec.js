import { strict as assert } from 'node:assert'
import { createTestUser } from '../../../../test_utils/create_agent'
import gqlBuilder from '../../../../../src/libs/gql_builder'

let agent
let user
describe('updateUser', () => {
    beforeEach(async () => {
        const { agent: a, user: u } = await createTestUser()
        agent = a
        user = u
    })

    it('should update user info', async () => {
        const response = await agent.post('/graphql').send({
            query: gqlBuilder.generateMutation({
                mutationName: 'updateUser',
                inputName: 'UpdateUserInput!',
                fields: '_id email firstName lastName created updated',
            }),
            variables: {
                input: {
                    firstName: 'newFirstName',
                    lastName: 'newLastName'
                }
            }
        })
        const { _id, email, firstName, lastName, created, updated } = response.body.data.updateUser
        assert.equal(_id, user._id)
        assert.equal(email, user.email)
        assert.equal(firstName, 'NewFirstName')
        assert.equal(lastName, 'NewLastName')
        assert.equal(created, user.created)
        assert.equal(updated > user.updated, true)
    })
})
