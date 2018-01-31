'use strict'

const axios = require('axios')

const API_VERSION = '3.0'
const API_PREFIX = process.env.LAYER_API || 'https://api.layer.com'
const TIMEOUT = process.env.LAYER_API_TIMEOUT || 10 * 1000

module.exports = class Request {
  /**
   * Request constructor from super
   * @constructor
   *
   * @param {string}  appId - Layer application ID
   * @param {string}  config.token - Layer API token
   * @param {array}   [config.permissions] - Layer API token permissions
   * @param {array}   [config.timeout] - Layer API timeout in ms
   */
  constructor (appId, config) {
    const request = axios.create({
      baseURL: `${API_PREFIX}/apps/${Request.toUUID(appId)}`,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': `application/vnd.layer+json; version=${API_VERSION}`
      },
      timeout: config.timeout || TIMEOUT
    })

    this._api = {
      get: (url, data) => request({ method: 'get', url, data }),
      post: (url, data) => request({ method: 'post', url, data }),
      put: (url, data) => request({ method: 'put', url, data }),
      patch: (url, data) => request({ method: 'patch', url, data, headers: { 'Content-Type': 'application/vnd.layer-patch+json' } }),
      delete: (url, data) => request({ method: 'delete', url, data })
    }
  }

  /**
   * Convert any Layer prefixed ID to UUID
   */
  static toUUID (id) {
    return (id || '').replace(/^.*\//, '')
  }

  /**
   * Ensure plain ID has correct Layer prefix
   *
   * @param  {String} type Layer prefix type
   * @param  {String} val  ID value
   */
  static toLayerPrefix (type, val) {
    const prefix = `layer:///${type}/`
    return val.startsWith(prefix) ? val : `${prefix}${val}`
  }
}
