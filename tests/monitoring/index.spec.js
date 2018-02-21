/* global describe it  */

const config = require('../resources/layer_config.json')

const Monitoring = require('../../src/monitoring')

const awsContext = {
  logGroupName: '/aws/lambda/tester-verify',
  logStreamName: '2017/10/12/[$LATEST]af5d4730f524403ca94c6341f751d1a5',
  functionName: 'tester-verify',
  memoryLimitInMB: '1024',
  functionVersion: '$LATEST',
  invokeid: 'bef10a18-afa2-11e7-a4bd-a72326052b60',
  awsRequestId: 'bef10a18-afa2-11e7-a4bd-a72326052b60',
  invokedFunctionArn: 'arn:aws:lambda:ap-southeast-1:154471726343:function:tester-one'
}

describe('Monitoring', () => {
  describe('formatMessage', () => {
    it('should return valid payload', () => {
      const message = Monitoring.formatMessage('test message', 'warning', 'test-service')
      message.should.eql('WARNING: [test-service] test message')
    })
  })

  describe('enableMonitoring', () => {
    it('should return true for pagerduty', () => {
      const enable = Monitoring.enableMonitoring({ pagerduty: {} })
      enable.should.eql(true)
    })
    it('should return true for sentry', () => {
      const enable = Monitoring.enableMonitoring({ sentry: {} })
      enable.should.eql(true)
    })
    it('should return true if both pagerduty and sentry', () => {
      const enable = Monitoring.enableMonitoring({ pagerduty: {}, sentry: {} })
      enable.should.eql(true)
    })
    it('should return false if invalid', () => {
      const enable = Monitoring.enableMonitoring({ foo: {} })
      enable.should.eql(false)
    })
  })

  describe('getLinks', () => {
    it('should return valid payload', () => {
      const links = Monitoring.getLinks({ provider: 'aws' }, awsContext)
      links.should.be.Array()
      links.length.should.be.eql(1)
    })
  })
})
