'use strict'

const Request = require('./request')

/**
 * Message operations
 * https://docs.layer.com/reference/server_api/messages.out
 */
module.exports = (api) => {
  return {
    /**
     * Send a message
     */
    send (conversationId, senderId, parts) {
      const conversationUUID = Request.toUUID(conversationId)
      const message = { sender_id: Request.toLayerPrefix('identities', senderId), parts }
      return api
        .post(`conversations/${conversationUUID}/messages`, message)
    },

    /**
     * Get all messages for a conversation
     */
    getAll (conversationId) {
      const conversationUUID = Request.toUUID(conversationId)
      return api
        .get(`conversations/${conversationUUID}/messages`)
    },

    /**
     * Get a message for a conversation
     */
    get (conversationId, messageId) {
      const conversationUUID = Request.toUUID(conversationId)
      const messageUUID = Request.toUUID(messageId)
      return api
        .get(`conversations/${conversationUUID}/messages/${messageUUID}`)
    },

    /**
     * Add a new message part
     */
    addPart (conversationId, messageId, part) {
      const conversationUUID = Request.toUUID(conversationId)
      const messageUUID = Request.toUUID(messageId)
      return api
        .post(`conversations/${conversationUUID}/messages/${messageUUID}/parts`, part)
    },

    /**
     * Get a message part
     */
    getParts (conversationId, messageId) {
      const conversationUUID = Request.toUUID(conversationId)
      const messageUUID = Request.toUUID(messageId)
      return api
        .get(`conversations/${conversationUUID}/messages/${messageUUID}/parts`)
    },

    /**
     * Get all message parts of a conversation
     */
    getPart (conversationId, messageId, partId) {
      const conversationUUID = Request.toUUID(conversationId)
      const messageUUID = Request.toUUID(messageId)
      const partUUID = Request.toUUID(partId)
      return api
        .get(`conversations/${conversationUUID}/messages/${messageUUID}/parts/${partUUID}`)
    },

    /**
     * Update a message part
     */
    updatePart (conversationId, messageId, partId, part) {
      const conversationUUID = Request.toUUID(conversationId)
      const messageUUID = Request.toUUID(messageId)
      const partUUID = Request.toUUID(partId)
      return api
        .put(`conversations/${conversationUUID}/messages/${messageUUID}/parts/${partUUID}`, part)
    },

    /**
     * Replace all message parts
     */
    replaceParts (conversationId, messageId, parts) {
      const conversationUUID = Request.toUUID(conversationId)
      const messageUUID = Request.toUUID(messageId)
      return api
        .put(`conversations/${conversationUUID}/messages/${messageUUID}/parts`, parts)
    },

    /**
     * delete a message part
     */
    deletePart (conversationId, messageId, partId) {
      const conversationUUID = Request.toUUID(conversationId)
      const messageUUID = Request.toUUID(messageId)
      const partUUID = Request.toUUID(partId)
      return api
        .delete(`conversations/${conversationUUID}/messages/${messageUUID}/parts/${partUUID}`)
    },

    /**
     * Delete a message
     */
    delete (conversationId, messageId) {
      const conversationUUID = Request.toUUID(conversationId)
      const messageUUID = Request.toUUID(messageId)
      return api
        .delete(`conversations/${conversationUUID}/messages/${messageUUID}`)
    }
  }
}
