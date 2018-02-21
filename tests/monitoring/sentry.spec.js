/* global describe it  */

const sinon = require('sinon')
const Raven = require('raven')
const config = require('../resources/layer_config.json')

const Sentry = require('../../src/monitoring/sentry')

describe('Sentry', () => {
  describe('Constructor', () => {
    it('should invoke sentry API with the correct dsn', () => {
      const sentryCreateSpy = sinon.spy(Raven, 'config')
      const pd = new Sentry(config, [])

      sentryCreateSpy.callCount.should.be.eql(1)
      sentryCreateSpy.calledWith(config.sentry.dsn, {
        captureUnhandledRejections: true
      }).should.be.eql(true)
    })
  })
})
