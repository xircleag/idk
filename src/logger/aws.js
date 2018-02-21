'use strict'

const level = require('./levels').indexOf(process.env.LOG_LEVEL) || 0

module.exports = class LoggerAWS {
  /**
   * @param  {string} service - Service name
   * @param  {object} logger - Logger object
   * @param  {PagerDuty} pagerduty - PagerDuty instance or null
   *
   * @return {object} Loger functions for each level
   */
  constructor (service, logger, monitoring) {
    this.service = service
    this.logger = logger
    this.monitoring = monitoring
  }

  debug (message, params) {
    if (level > 0) return

    this.logger.log(this._formatMessage(message), params || '')
  }

  info (message, params) {
    if (level > 1) return

    this.logger.info(this._formatMessage(message), params || '')
  }

  warn (message, params) {
    if (level > 2) return

    this.logger.warn(this._formatMessage(message), params || '')
    if (this.monitoring) this.monitoring.warning(message, params)
  }

  error (message, params) {
    if (level > 3) return

    this.logger.error(this._formatMessage(message), params || '')
    if (this.monitoring) this.monitoring.error(message, params)
  }

  _formatMessage (message) {
    return `${this.service}${message}`
  }
}
