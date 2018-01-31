'use strict'

const level = require('./levels').indexOf(process.env.LOG_LEVEL) || 0

module.exports = class LoggerAzure {
  /**
   * @param  {string} service - Service name
   * @param  {object} logger - Logger object
   * @param  {PagerDuty} pagerduty - PagerDuty instance or null
   *
   * @return {object} Loger functions for each level
   */
  constructor (service, logger, pagerduty) {
    this.service = service
    this.logger = logger
    this.pagerduty = pagerduty
  }

  debug (message, params) {
    if (level > 0) return

    this.logger.verbose(this._formatMessage(message, params))
  }

  info (message, params) {
    if (level > 1) return

    this.logger.info(this._formatMessage(message, params))
  }

  warn (message, params) {
    if (level > 2) return

    this.logger.warn(this._formatMessage(message, params))
    if (this.pagerduty) this.pagerduty.warning(message, params)
  }

  error (message, params) {
    if (level > 3) return

    this.logger.error(this._formatMessage(message, params))
    if (this.pagerduty) this.pagerduty.critical(message, params)
  }

  /**
   * Azure logger doesn't support object parameters, only message string
   */
  _formatMessage (message, params) {
    let details = ''

    if (params instanceof Error) details = `${params.message} ${params.stack}`
    else if (typeof params === 'object') details = JSON.stringify(params)

    return `${this.service}${message} ${details}`
  }
}
