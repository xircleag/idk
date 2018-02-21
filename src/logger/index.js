'use strict'

const LoggerAWS = require('./aws')
const LoggerAzure = require('./azure')

const Monitoring = require('../monitoring')

/**
 * Logger factory
 *
 * @param  {object} context - Cloud function context
 * @return {object} Logger object
 */
module.exports = function (context) {
  const service = this.config.service_name ? `[${this.config.service_name}] ` : ''
  const provider = this.config.provider || 'aws'

  let monitoring = null
  if (Monitoring.enableMonitoring(this.config)) {
    monitoring = new Monitoring(this.config, context)
  }

  switch (provider.toLowerCase()) {
    case 'aws':
      return new LoggerAWS(service, console, monitoring)
    case 'azure':
      return new LoggerAzure(service, context.log, monitoring)
    default:
      throw new Error(`Invalid log provider '${provider}'`)
  }
}
