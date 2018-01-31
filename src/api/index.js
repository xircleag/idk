'use strict'

const Request = require('./request')

const conversations = require('./conversations')
const identities = require('./identities')
const messages = require('./messages')

module.exports = class API extends Request {
  /**
   * API constructor
   * @constructor
   */
  constructor (appId, config) {
    super(appId, config)

    this.conversations = conversations(this._api)
    this.identities = identities(this._api)
    this.messages = messages(this._api)
  }
}
