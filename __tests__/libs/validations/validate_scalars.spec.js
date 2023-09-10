import { strict as assert } from 'assert'
import { isValidEmail, isValidJwtToken, isValidObjectId, isValidPassword } from '../../../src/libs/validations/validate_scalars'
import { generateFakeData } from '../../test_utils/fake_data'

describe('validate_scalars', () => {
    describe('isValidEmail', () => {
        it('should return true if email is valid', () => {
            const email = generateFakeData().user.email
            const isValid = isValidEmail(email)
            assert.equal(isValid, true)
        })

        it('should return false if email is not valid', () => {
            const email = 'invalid_email'
            const isValid = isValidEmail(email)
            assert.equal(isValid, false)
        })
    })

    describe('isValidPassword', () => {
        it('should return true if password is valid', () => {
            assert.equal(isValidPassword('Hello@123'), true)
            assert.equal(isValidPassword('ahehdH_123'), true)
            assert.equal(isValidPassword('@Ux]dhdU12h'), true)
            assert.equal(isValidPassword('invalid Y_12password'), true)
            assert.equal(isValidPassword('1234Hskdkdk'), true)
        })

        it('should return false if password is not valid', () => {
            assert.equal(isValidPassword('invalid_password'), false)
            assert.equal(isValidPassword('inval'), false)
            assert.equal(isValidPassword('in12HY'), false)
        })
    })

    describe('isValidObjectId', () => {
        it('should return true if id is valid', () => {
            const id = '60b0f4b7e1b9f3a0e4e7b7e0'
            const isValid = isValidObjectId(id)
            assert.equal(isValid, true)
        })

        it('should return false if id is not valid', () => {
            const id = 'invalid_id'
            const isValid = isValidObjectId(id)
            assert.equal(isValid, false)
        })
    })

    describe('isValidToken', () => {
        it('should return true if token is valid', () => {
            const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJpZCI6IjYwYjBmNGI3ZTFiOWYzYTBlNGU3YjdlMCIsImVtYWlsIjoiZm.FrZUBtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkZha2UiLCJsYXN0TmFtZSI6IkZha2UiLCJwYXNzd29yZC'
            const isValid = isValidJwtToken(jwtToken)
            assert.equal(isValid, true)
        })

        it('should return false if token is not valid', () => {
            const token = 'invalid_token'
            const isValid = isValidJwtToken(token)
            assert.equal(isValid, false)
        })
    })
})
