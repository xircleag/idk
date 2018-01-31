'use strict'

const LoggerAWS = require('./aws')
const LoggerAzure = require('./azure')

const PagerDuty = require('./pagerduty')

/**
 * Logger factory
 *
 * @param  {object} context - Cloud function context
 * @return {object} Logger object
 */
module.exports = function (context) {
  const service = this.config.service_name ? `[${this.config.service_name}] ` : ''
  const provider = this.config.provider || 'aws'

  let pagerduty = null
  if (this.config.pagerduty && this.config.app_id) {
    pagerduty = new PagerDuty(this.config, context)
  }

  switch (provider.toLowerCase()) {
    case 'aws':
      return new LoggerAWS(service, console, pagerduty)
    case 'azure':
      return new LoggerAzure(service, context.log, pagerduty)
    default:
      throw new Error(`Invalid log provider '${provider}'`)
  }
}
