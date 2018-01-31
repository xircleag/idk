'use strict'

const axios = require('axios')

/**
 * PagerDuty API
 * https://v2.developer.pagerduty.com/docs/rest-api
 */
module.exports = class PagerDuty {
  constructor (config, context) {
    this.config = config
    this.context = context

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
    return this.request.post('/enqueue', this._payload(message, params, 'warning'))
      .catch((err) => console.log('PagerDuty', err))
  }

  critical (message, params) {
    return this.request.post('/enqueue', this._payload(message, params, 'warning'))
      .catch((err) => console.log('PagerDuty', err))
  }

  _payload (message, params, severity) {
    let details = params || null
    if (params instanceof Error) details = { message: params.message, stack: params.stack }

    const { config, context } = this
    return {
      routing_key: config.pagerduty.integration_key,
      event_action: 'trigger',
      payload: {
        summary: PagerDuty.formatMessage(message, severity, config.service_name),
        custom_details: details,
        component: config.service_name || '',
        group: config.provider || '',
        source: config.app_id || '',
        severity
      },
      timestamp: Date.now(),
      links: PagerDuty.getLinks(config.provider, context)
    }
  }

  static formatMessage (message, severity, service) {
    return `${severity.toUpperCase()}: [${service}] ${message}`
  }

  static getLinks (provider, context) {
    if (!provider) return []

    const links = []
    switch (provider) {
      case 'aws':
        if (!context) return links

        try {
          const invokedFunctionArn = context.invokedFunctionArn
          const functionParts = invokedFunctionArn.split(':')
          const region = functionParts[3] || 'us-east-1'
          links.push(`https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#logEventViewer:group=${context.logGroupName};stream=${context.logStreamName};filter="${context.awsRequestId}"`)
        } catch (err) {
          // nop
        }

        return links
      case 'azure':
        return links
      default:
        return links
    }
  }
}
