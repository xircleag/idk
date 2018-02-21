"use strict";

const Raven = require("raven")

/*
 * Sentry API
 * https://docs.sentry.io/clients/node/
 */
module.exports = class Sentry {
  constructor (config, links) {
    this.config = config
    this.links = links

    Raven.config(config.sentry.dsn, {
      captureUnhandledRejections: true
    }).install()
  }

  warning (message, params) {
    const { service_name, provider, app_id } = this.config
    const options = {
      level: 'warning',
      extra: {
        message,
        service_name,
        provider,
        app_id,
        links: this.links
      }
    }
    Raven.captureException(params || {}, options)
  }

  error (message, params) {
    const { service_name, provider, app_id } = this.config
    const options = {
      level: 'error',
      extra: {
        message,
        service_name,
        provider,
        app_id,
        links: this.links
      }
    }
    Raven.captureException(params || {}, options)
  }
}
