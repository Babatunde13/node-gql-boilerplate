import { strict as assert } from 'assert'
import envs from '../../src/config/envs'
import { AppDBConnection } from '../../src/config/app_db_connection'
import AppError from '../../src/libs/error'

let db

describe('AppDBConnection', () => {
    it('should set the url', () => {
        db = new AppDBConnection(envs.database.url + '_test')
        assert.equal(db.url, envs.database.url + '_test')
    })

    describe('connect', () => {
        it('should return error if it could not connect to db', async () => {
            db = new AppDBConnection('invalid url')
            const { error } = await db.connect()
            assert.equal(error instanceof AppError, true)

            await db.disconnect()
        })

        it('should be able to connect to the database', async () => {
            db = new AppDBConnection(envs.database.url + '_test')
            const { data } = await db.connect()
            assert.ok(data.db)
        })
    })
    
    describe('disconnect', () => {
        it('should return error if it could not disconnect from db', async () => {
            db = new AppDBConnection('invalid url')
            const { error } = await db.disconnect()
            assert.equal(error instanceof AppError, true)
        })

        it('should be able to disconnect from the database', async () => {
            db = new AppDBConnection(envs.database.url + '_test')
            await db.connect()
            const { data } = await db.disconnect()
            assert.equal(data, true)
        })
    })

    describe('drop', () => {
        it('should be drop db', async () => {
            db = new AppDBConnection(envs.database.url + '_test')
            await db.connect()
            const { data } = await db.drop()
            assert.equal(data, true)
        })

        it('should return error if it could not drop db', async () => {
            db = new AppDBConnection('invalid url')
            const { error } = await db.drop()
            assert.equal(error instanceof AppError, true)
        })
    })
})
