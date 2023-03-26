import { test } from 'uvu'
import * as assert from 'uvu/assert'
import request from 'supertest'
import { app } from './app'
import { StatusCodes } from 'http-status-codes'

const TestApp = request(app)

test('root get', async () => {
  return new Promise((resolve, reject) => {
    TestApp.get('/')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return reject(err)
        assert.type(res.body, 'object')
        assert.type(res.body.version, 'string')
        assert.type(res.body.name, 'string')

        resolve()
      })
  })
})

test('api v1', async () => {
  return new Promise((resolve, reject) => {
    TestApp.get('/v1')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return reject(err)
        assert.type(res.body, 'object')
        assert.instance(res.body.data, Array)
        assert.type(res.body.data[0], 'string')
        resolve()
      })
  })
})

test.run()
