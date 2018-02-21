'use strict'

const PagerDuty = require('./pagerduty')
const Sentry = require('./sentry')

const SERVICES = ['pagerduty', 'sentry']

/**
 * Monitoring interface
 */
module.exports = class Monitoring {
  constructor (config, context) {
    this.config = config
    this.context = context

    const links = Monitoring.getLinks(config, context)

    if (config.pagerduty) this.pagerduty = new PagerDuty(config, links)
    if (config.sentry) this.sentry = new Sentry(config, links)
  }

  warning (message, params) {
    message = Monitoring.formatMessage(message, 'warning', this.config.service_name)

    if (this.pagerduty) this.pagerduty.warning(message, params)
    if (this.sentry) this.sentry.warning(message, params)
  }

  error (message, params) {
    message = Monitoring.formatMessage(message, 'warning', this.config.service_name)

    if (this.pagerduty) this.pagerduty.error(message, params)
    if (this.sentry) this.sentry.error(message, params)
  }

  static formatMessage (message, severity, service) {
    return `${severity.toUpperCase()}: [${service}] ${message}`
  }

  static enableMonitoring (config) {
    return Object.keys(config).some((service) => SERVICES.includes(service))
  }

  static getLinks ({ provider }, context) {
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
