const Hapi = require('hapi')
const Kafka = require('node-rdkafka')
const sinon = require('sinon')
const KakfaClientPlugin = require('../../lib')

let server = null

beforeEach(async () => {
  server = Hapi.server({
    host: 'localhost',
  })

  await server.start()
})

afterEach(() => {
  // sinon.restore()
  server.stop()
})

describe('hapi kafka client plugin', () => {
  test('should be able to validate options and raise an error', async (done) => {
    try {
      await server.register({
        plugin: KakfaClientPlugin,
        options: {
          port: 'bad-port',
        },
      })
      done()
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
      expect(err.name).toBe('ValidationError')
      done()
    }
  })

  // TODO: validate that if we pass SASL auth we use SASL as security protocol
  // test.only('should be able to register a new producer with SASL protocol', async () => {
  //   const producer = sinon.spy(Kafka, 'Producer')
  //   await server.register({
  //     plugin: KakfaClientPlugin,
  //     options: {
  //       auth: 'SASL',
  //       username: 'fake-username',
  //       password: 'fake-password',
  //     },
  //   })

  //   expect(producer.called).toEqual(true)
  //   expect(server.plugins).toHaveProperty('kafka')
  //   expect(server.plugins.kafka).toHaveProperty('producer')
  //   expect(server.plugins.kafka.producer).toBeInstanceOf(Kafka.Producer)
  // })

  test('should be able to  register a new producer', async () => {
    await server.register({
      plugin: KakfaClientPlugin,
      options: {},
    })
    expect(server.plugins).toHaveProperty('kafka')
    expect(server.plugins.kafka).toHaveProperty('producer')
    expect(server.plugins.kafka.producer).toBeInstanceOf(Kafka.Producer)
  })
})
