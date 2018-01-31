/* global describe it  */

const config = require('./resources/layer_config.json')

const LayerIDK = require('../')
const layerIDK = new LayerIDK(config)

const req = require('./resources/req.json')

describe('Webhook', () => {
  it('should return webhook payload as JSON', () => {
    const webhook = layerIDK.webhook(req.headers, req.body)
    webhook.should.be.eql(JSON.parse(req.body))
  })

  it('should throw error on missing user agent', () => {
    (function () {
      const headers = Object.assign({}, req.headers)
      delete headers['User-Agent']
      layerIDK.webhook(headers, req.body)
    }).should.throw('Missing Webhook User-Agent header')
  })

  it('should throw error on invalid user agent', () => {
    (function () {
      const headers = Object.assign({}, req.headers)
      headers['User-Agent'] = 'foo-bar'
      layerIDK.webhook(headers, req.body)
    }).should.throw('Invalid Webhook User-Agent header')
  })

  it('should throw error on missing body', () => {
    (function () {
      const body = null
      layerIDK.webhook(req.headers, body)
    }).should.throw('Missing Webhook body')
  })

  it('should throw error on invalid signature', () => {
    (function () {
      const headers = Object.assign({}, req.headers)
      headers['layer-webhook-signature'] = 'foo'
      layerIDK.webhook(headers, req.body)
    }).should.throw('Invalid Webhook signature, check your secret')
  })

  it('should throw error on invalid event type', () => {
    (function () {
      const headers = Object.assign({}, req.headers)
      headers['layer-webhook-event-type'] = 'foo'
      layerIDK.webhook(headers, req.body)
    }).should.throw('Invalid Webhook event type "foo"')
  })
})
