'use strict'

const crypto = require('crypto')

const USER_AGENT = 'layer-webhooks'
const HEADERS = {
  signature: 'layer-webhook-signature',
  eventType: 'layer-webhook-event-type'
}

/**
 *  Verify and parse Layer webhook
 */
module.exports = function (headers, body) {
  /**
   * Check for valid user-agent
   */
  const userAgent = headers['User-Agent'] || headers['user-agent']
  if (typeof userAgent !== 'string') throw new Error('Missing Webhook User-Agent header')
  if (!userAgent.includes(USER_AGENT)) throw new Error('Invalid Webhook User-Agent header')

  /**
   * Check webhook payload integrity
   */
  if (typeof body !== 'string') throw new Error('Missing Webhook body')
  const signature = headers[HEADERS.signature]
  const hash = crypto.createHmac('sha1', this.config.webhook.secret).update(body).digest('hex')
  if (hash !== signature) throw new Error('Invalid Webhook signature, check your secret')

  /**
   * Verify if event type is valid
   */
  const eventType = headers[HEADERS.eventType]
  if (!this.config.webhook.events.includes(eventType)) throw new Error(`Invalid Webhook event type "${eventType}"`)

  /**
   * Parse body string to JSON
   */
  try {
    return JSON.parse(body)
  } catch (err) {
    throw new Error('Error parsing Webhook body to JSON')
  }
}
