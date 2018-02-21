/* global describe it  */

const config = require('./resources/layer_config.json')

const LayerIDK = require('../')

const context = {
  aws: {
    awsRequestId: 'foo'
  },
  azure: {
    log: {
      verbose: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    }
  }
}

const params = { foo: 'bar' }

describe('Logger', () => {
  describe('AWS context', () => {
    const layerIDK = new LayerIDK(config)
    const log = layerIDK.logger(context.aws)

    it('should log.debug', () => {
      log.debug('hello debug', params)
    })
    it('should log.info', () => {
      log.info('hello info', params)
    })
    it('should log.warn', () => {
      log.warn('hello warn', params)
    })
    it('should log.error', () => {
      log.error('hello error', new Error('boom'))
    })
  })

  describe('Azure context', () => {
    const azureConfig = Object.assign({ provider: 'azure'}, config)
    const layerIDK = new LayerIDK(azureConfig)
    const log = layerIDK.logger(context.azure)

    it('should log.debug', () => {
      log.debug('hello debug', params)
    })
    it('should log.info', () => {
      log.info('hello info', params)
    })
    it('should log.warn', () => {
      log.warn('hello warn', params)
    })
    it('should log.error', () => {
      log.error('hello error', new Error('boom'))
    })
  })
})
