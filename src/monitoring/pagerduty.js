'use strict'

const axios = require('axios')

/**
 * PagerDuty API
 * https://v2.developer.pagerduty.com/docs/rest-api
 */
module.exports = class PagerDuty {
  constructor (config, links) {
    this.config = config
    this.links = links

    this.request = axios.create({
      baseURL: 'https://events.pagerduty.com/v2',
      timeout: 6000,
      headers: {
        'Accept': 'application/vnd.pagerduty+json;version=2',
        'Content-Type': 'application/json',
        'Authorization': 'Token token=' + config.pagerduty.api_key
      }
    })
  }

  warning (message, params) {
    this.request.post('/enqueue', this._payload(message, params, 'warning'))
      .catch((err) => console.log('PagerDuty', err))
  }

  error (message, params) {
    this.request.post('/enqueue', this._payload(message, params, 'error'))
      .catch((err) => console.log('PagerDuty', err))
  }

  _payload (message, params, severity) {
    let details = params || null
    if (params instanceof Error) details = { message: params.message, stack: params.stack }

    const { config, links } = this
    return {
      routing_key: config.pagerduty.integration_key,
      event_action: 'trigger',
      payload: {
        summary: message,
        custom_details: details,
        component: config.service_name || '',
        group: config.provider || '',
        source: config.app_id || '',
        severity
      },
      timestamp: Date.now(),
      links
    }
  }
}
