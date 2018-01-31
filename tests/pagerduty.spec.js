/* global describe it  */

const config = require('./resources/layer_config.json')

const PagerDuty = require('../src/logger/pagerduty')

const awsContext = {
  logGroupName: '/aws/lambda/paytm-storage-tester-verify',
  logStreamName: '2017/10/12/[$LATEST]af5d4730f524403ca94c6341f751d1a5',
  functionName: 'paytm-storage-tester-verify',
  memoryLimitInMB: '1024',
  functionVersion: '$LATEST',
  invokeid: 'bef10a18-afa2-11e7-a4bd-a72326052b60',
  awsRequestId: 'bef10a18-afa2-11e7-a4bd-a72326052b60',
  invokedFunctionArn: 'arn:aws:lambda:ap-southeast-1:154471726343:function:tester-one'
}

describe('PagerDuty', () => {
  describe('getPayload warning', () => {
    const pd = new PagerDuty(config, awsContext)

    it('should return valid payload', () => {
      const payload = pd._payload('test message', { foo: 'bar' }, 'warning')

      payload.routing_key.should.eql('fake-key2')
      payload.event_action.should.eql('trigger')

      payload.payload.summary.should.eql('WARNING: [test-service] test message')
      payload.payload.custom_details.should.eql({ foo: 'bar' })
      payload.payload.component.should.eql(config.service_name)
      payload.payload.group.should.eql(config.provider)
      payload.payload.source.should.eql(config.app_id)
      payload.payload.severity.should.eql('warning')

      payload.timestamp.should.be.Number()
      payload.links.should.be.Array()
    })
  })

  describe('getPayload critical', () => {
    const pd = new PagerDuty(config, awsContext)

    it('should return valid payload', () => {
      const payload = pd._payload('test message', new Error('testing'), 'critical')

      payload.routing_key.should.eql('fake-key2')
      payload.event_action.should.eql('trigger')

      payload.payload.summary.should.eql('CRITICAL: [test-service] test message')
      payload.payload.custom_details.should.be.Object()
      payload.payload.component.should.eql(config.service_name)
      payload.payload.group.should.eql(config.provider)
      payload.payload.source.should.eql(config.app_id)
      payload.payload.severity.should.eql('critical')

      payload.timestamp.should.be.Number()
      payload.links.should.be.Array()
    })
  })
})
