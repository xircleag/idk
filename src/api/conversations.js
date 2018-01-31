'use strict'

const Request = require('./request')

/**
 * Conversation operations
 * https://docs.layer.com/reference/server_api/conversations.out
 */
module.exports = (api) => {
  return {
    /**
     * Create a new conversation
     */
    create (participants, metadata, distinct) {
      const payload = {
        participants,
        metadata: metadata || {},
        distinct: distinct || false
      }
      return api
        .post('conversations', payload)
    },

     /**
     * Get a conversation
     */
    get (conversationId) {
      return api
        .get(`conversations/${Request.toUUID(conversationId)}`)
    },

    /**
     * Delete a conversation
     */
    delete (conversationId) {
      return api
        .delete(`conversations/${Request.toUUID(conversationId)}`)
    },

    /**
     * Add participants to a conversation
     */
    addParticipants (conversationId, participants) {
      const operations = participants.map((id) => {
        return {
          operation: 'add',
          property: 'participants',
          value: Request.toLayerPrefix('identities', id)
        }
      })
      return api
        .patch(`conversations/${Request.toUUID(conversationId)}`, operations)
    },

    /**
     * Remove participants from a conversation
     */
    removeParticipants (conversationId, participants) {
      const operations = participants.map((id) => {
        return {
          operation: 'remove',
          property: 'participants',
          value: Request.toLayerPrefix('identities', id)
        }
      })
      return api
        .patch(`conversations/${Request.toUUID(conversationId)}`, operations)
    },

    /**
     * Update metadata for a conversation
     */
    updateMetadata (conversationId, operations) {
      return api
        .patch(`conversations/${Request.toUUID(conversationId)}`, operations)
    },

    /**
     * Mark a conversation as read
     */
    markAsRead (conversationId, userId, position) {
      const payload = {
        position: position || null
      }
      return api
        .post(`users/${Request.toUUID(userId)}/conversations/${Request.toUUID(conversationId)}/mark_all_read`, payload)
    }
  }
}
