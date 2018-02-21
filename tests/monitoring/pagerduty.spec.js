/* global describe it  */

const sinon = require('sinon')
const axios = require('axios')
const config = require('../resources/layer_config.json')

const PagerDuty = require('../../src/monitoring/pagerduty')

describe('PagerDuty', () => {
  describe('Constructor', () => {
    it('should invoke pagerduty API with the correct key', () => {
      const axiosCreateSpy = sinon.spy(axios, 'create')
      const pd = new PagerDuty(config, [])

      axiosCreateSpy.callCount.should.be.eql(1)
      axiosCreateSpy.calledWith({
        baseURL: 'https://events.pagerduty.com/v2',
        timeout: 6000,
        headers: {
          'Accept': 'application/vnd.pagerduty+json;version=2',
          'Content-Type': 'application/json',
          'Authorization': 'Token token=' + config.pagerduty.api_key
        }
      }).should.be.eql(true)
    })
  })

  describe('_payload warning', () => {
    const pd = new PagerDuty(config, [])

    it('should return valid payload', () => {
      const payload = pd._payload('test message', { foo: 'bar' }, 'warning')

      payload.routing_key.should.eql('fake-key2')
      payload.event_action.should.eql('trigger')

      payload.payload.summary.should.eql('test message')
      payload.payload.custom_details.should.eql({ foo: 'bar' })
      payload.payload.component.should.eql(config.service_name)
      payload.payload.group.should.eql(config.provider)
      payload.payload.source.should.eql(config.app_id)
      payload.payload.severity.should.eql('warning')

      payload.timestamp.should.be.Number()
      payload.links.should.be.Array()
    })
  })

  describe('_payload error', () => {
    const pd = new PagerDuty(config, [])

    it('should return valid payload', () => {
      const payload = pd._payload('test message', new Error('testing'), 'error')

      payload.routing_key.should.eql('fake-key2')
      payload.event_action.should.eql('trigger')

      payload.payload.summary.should.eql('test message')
      payload.payload.custom_details.should.be.Object()
      payload.payload.component.should.eql(config.service_name)
      payload.payload.group.should.eql(config.provider)
      payload.payload.source.should.eql(config.app_id)
      payload.payload.severity.should.eql('error')

      payload.timestamp.should.be.Number()
      payload.links.should.be.Array()
    })
  })
})
