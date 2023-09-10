import { strict as assert } from 'node:assert'
import AppError from '../../src/libs/error'

describe('AppError', () => {
    it('should set an error name', () => {
        const error = new AppError({ message: 'oops', type: 'MY_ERROR' })
    
        assert.equal(error.message, 'oops')
        assert.equal(error.name, 'App Error')
    })
    
    it('should create from an actual error', () => {
        const error = new Error('oops')
        error.name = 'My Error'
        const err = new AppError(error)
    
        assert.equal(err.message, 'oops')
        assert.equal(err.name, 'My Error')
    })
    
    describe('addMetaData', () => {
        it('should add error metadata', () => {
            const error = new AppError({ message: 'oops' })
            error.addMetadata({
                email: {
                    errors: [
                        {
                            message: 'request failed'
                        }
                    ]
                }
            })
    
            assert.deepEqual(error.metadata, {
                email: {
                    errors: [
                        {
                            message: 'request failed'
                        }
                    ]
                }
            })
        })

        it('should create a new metadata object', () => {
            const error = new AppError({ message: 'oops' })
            error.addMetadata({
                projectid: '123'
            })
    
            assert.deepEqual(error.metadata, {
                projectid: '123'
            })
        })
    
        it('should add more metadata', () => {
            const error = new AppError({ message: 'oops' })
            error.addMetadata({
                projectid: '123'
            })
    
            assert.deepEqual(error.metadata, {
                projectid: '123'
            })
    
            error.addMetadata({
                modelid: 'abc'
            })

            assert.deepEqual(error.metadata, {
                projectid: '123',
                modelid: 'abc'
            })
        })
    })
})
