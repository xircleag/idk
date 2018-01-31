'use strict'

const Request = require('./request')

/**
 * User identity operations
 * https://docs.layer.com/reference/server_api/identities.out
 */
module.exports = (api) => {
  return {
    /**
     * Create a new identity
     */
    create (userId, identity) {
      return api
        .post(`users/${Request.toUUID(userId)}/identity`, identity)
    },

    /**
     * Update identity
     */
    update (userId, identity) {
      const operations = []
      Object.keys(identity).forEach((key) => {
        const value = identity[key]
        if (key === 'metadata') {
          Object.keys(value).forEach((mkey) => {
            operations.push({
              operation: 'set',
              property: `metadata.${mkey}`,
              value: value[mkey]
            })
          })
        } else {
          operations.push({
            operation: 'set',
            property: key,
            value
          })
        }
      })
      return api
        .patch(`users/${Request.toUUID(userId)}/identity`, operations)
    },

    /**
     * Get identity from userId
     */
    get (userId) {
      return api
        .get(`users/${Request.toUUID(userId)}/identity`)
    },

    /**
     * Replace identity
     */
    replace (userId, identity) {
      return api
        .put(`users/${Request.toUUID(userId)}/identity`, identity)
    },

    /**
     * Delete identity
     */
    delete (userId) {
      return api
        .delete(`users/${Request.toUUID(userId)}/identity`)
    }
  }
}
