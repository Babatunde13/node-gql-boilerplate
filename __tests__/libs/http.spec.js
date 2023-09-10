import { strict as assert } from 'assert'
import http from '../../src/libs/http'
import mockRequest from '../test_utils/mock'
import AppError from '../../src/libs/error'

describe('Http', () => {
    describe('get', () => {
        it('should return an error', async () => {
            const url = 'http://test.com'
            const agent = mockRequest(url)
            agent.get('/').reply(400)
            const response = await http.get('http://test.com/')
            const error = new AppError({ error: new Error('Error: Request failed with status code 400'), type: 'HTTP_ERROR' })
            assert.equal(response.error.type, error.type)
        })

        it('should return a response', async () => {
            const url = 'http://test.com'
            const agent = mockRequest(url)
            agent.get('/').reply(200, { message: 'OK' })
            const response = await http.get('http://test.com/')
            assert.deepEqual(response, { data: { message: 'OK' } })
        })
    })
    describe('post', () => {
        it('should return an error', async () => {
            const url = 'http://test.com'
            const agent = mockRequest(url)
            agent.post('/', {}).reply(500)
            const response = await http.post('http://test.com/', {})
            const error = new AppError({ error: new Error('Error: Request failed with status code 500'), type: 'HTTP_ERROR' })
            assert.equal(response.error.type, error.type)
        })

        it('should return a response', async () => {
            const url = 'http://test.com'
            const agent = mockRequest(url)
            agent.post('/', {}).reply(200, { message: 'OK' })
            const response = await http.post('http://test.com/', {})
            assert.deepEqual(response, { data: { message: 'OK' } })
        })
    })
    describe('put', () => {
        it('should return an error', async () => {
            const url = 'http://test.com'
            const agent = mockRequest(url)
            agent.put('/', {}).reply(500)
            const response = await http.put('http://test.com/', {})
            const error = new AppError({ error: new Error('Error: Request failed with status code 500'), type: 'HTTP_ERROR' })
            assert.equal(response.error.type, error.type)
        })

        it('should return a response', async () => {
            const url = 'http://test.com'
            const agent = mockRequest(url)
            agent.put('/', {}).reply(200, { message: 'OK' })
            const response = await http.put('http://test.com/', {})
            assert.deepEqual(response, { data: { message: 'OK' } })
        })
    })
    describe('delete', () => {
        it('should return an error', async () => {
            const url = 'http://test.com'
            const agent = mockRequest(url)
            agent.delete('/', {}).reply(500)
            const response = await http.delete('http://test.com/', {})
            const error = new AppError({ error: new Error('Error: Request failed with status code 500'), type: 'HTTP_ERROR' })
            assert.equal(response.error.type, error.type)
        })

        it('should return a response', async () => {
            const url = 'http://test.com'
            const agent = mockRequest(url)
            agent.delete('/').reply(200, { message: 'OK' })
            const response = await http.delete('http://test.com/')
            assert.deepEqual(response, { data: { message: 'OK' } })
        })
    })
})
