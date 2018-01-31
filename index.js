'use strict'

const Utils = require('./src/utils')
const API = require('./src/api')

const logger = require('./src/logger')
const webhook = require('./src/webhook')

const LayerIDK = class LayerIDK extends Utils {
  constructor (config) {
    super(config)
    this.config = config

    if (config.api) {
      this.api = new API(config.app_id, config.api)
    }
  }
}

LayerIDK.prototype.logger = logger
LayerIDK.prototype.webhook = webhook

module.exports = LayerIDK
