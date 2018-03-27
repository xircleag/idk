'use strict'

const mediaType = require('media-type')

module.exports = class Utils {
  /**
   * Convert any Layer prefixed ID to UUID
   *
   * @param {string} id - Layer identifier
   * @returns {string} - UUID string
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

  /**
   * Execute an array of promises in a serial fashion
   *
   * @param {Array} operations - Array of Promise operations
   */
  static promiseSerial (operations) {
    return operations.reduce((promise, operation) =>
      promise.then((result) => operation().then(Array.prototype.concat.bind(result))),
      Promise.resolve([]))
  }

  /**
   * Split up an array into chunks
   *
   * @param {Array}   array - Input array
   * @param {Number}  size - Chunk size
   * @returns {Array} Two dimensional array of chunks
   */
  static chunkArray (array, size) {
    const results = []
    while (array.length) {
      results.push(array.splice(0, size))
    }
    return results
  }

  /**
   * Filter message parts based on mime_type and optional parameters
   *
   * @param  {Array} parts - Array of message parts
   *
   * @param  {Object} media - Mime type media object to match
   * @param  {string} media.subtype - Media subtype
   * @param  {string} [media.type] - Optional Media type
   * @param  {string} [media.suffix] - Optional Media suffix
   *
   * @param  {Object} [parameters] - Optional Hash of mime type parameters to match
   * @return {Array} Array of filtered message parts
   */
  static filterMessageParts (parts, media, parameters) {
    media = Object.assign({ type: 'application', suffix: 'json' }, media)
    if (!media.subtype) throw new Error('No media subtype to filter')

    return parts.filter((part) => {
      const mt = Utils.parseMimeType(part.mime_type)
      if (!mt.isValid()) return false

      if (mt.subtype !== media.subtype) return false
      if (mt.type !== media.type) return false
      if (mt.suffix !== media.suffix) return false

      if (!parameters) return true

      let matching = true
      Object.keys(parameters).forEach((key) => {
        if (!matching) return
        matching = mt.parameters[key] === parameters[key]
      })
      return matching
    })
  }

  /**
   * Parse mime type string object
   * https://github.com/lovell/media-type
   *
   * @param  {String} mimeType Layer message part mime_type
   * @return {Object}          media-type object
   */
  static parseMimeType (mimeType) {
    return mediaType.fromString(mimeType)
  }

  /**
   * Return the first text message part body
   * Matching text mime_type according to Layer XDK framework
   *
   * @param {Object} message - Message object
   * @returns {string} Message part body
   */
  static getMessageText (message) {
    const media = { subtype: 'vnd.layer.text' }
    const parameters = { role: 'root' }
    const parts = Utils.filterMessageParts(message.parts, media, parameters)
    return parts.length ? parts[0].body : null
  }
}
