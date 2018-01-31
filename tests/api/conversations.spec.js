/* global describe it */
'use strict'

const vcr = require('nock-vcr-recorder')
vcr.config({ cassetteLibraryDir: 'tests/api/cassetes' })

const config = require('../resources/layer_config.json')

const LayerIDK = require('../../')
const layerIDK = new LayerIDK(config)

let conversationId = null

describe('API', () => {
  describe('conversations.create', () => {
    it('should create a new conversation', () => {
      return vcr.useCassette('api.conversations.create:201', () => {
        const participants = ['123']
        const metadata = { foo: 'bar' }
        const distinct = false
        return layerIDK.api.conversations.create(participants, metadata, distinct)
          .then(({ status, data }) => {
            status.should.be.eql(201)
            data.should.have.properties(['url', 'participants', 'id', 'distinct', 'metadata', 'created_at', 'messages_url'])
            conversationId = data.id
          })
      })
    })
  })

  describe('conversations.get', () => {
    it('should return conversation object', () => {
      return vcr.useCassette('api.conversations.get:200', () => {
        return layerIDK.api.conversations.get(conversationId)
          .then(({ status, data }) => {
            status.should.be.eql(200)
            data.should.have.properties(['url', 'participants', 'id', 'distinct', 'metadata', 'created_at', 'messages_url'])
          })
      })
    })
  })

  describe('conversations.addParticipants', () => {
    it('should update conversation participants', () => {
      return vcr.useCassette('api.conversations.addParticipants:204', () => {
        const participants = ['456']
        return layerIDK.api.conversations.addParticipants(conversationId, participants)
          .then(({ status }) => {
            status.should.be.eql(204)
          })
      })
    })
  })

  describe('conversations.removeParticipants', () => {
    it('should update conversation participants', () => {
      return vcr.useCassette('api.conversations.removeParticipants:204', () => {
        const participants = ['456']
        return layerIDK.api.conversations.removeParticipants(conversationId, participants)
          .then(({ status }) => {
            status.should.be.eql(204)
          })
      })
    })
  })

  describe('conversations.updateMetadata', () => {
    it('should update metadata if passed correctly', () => {
      return vcr.useCassette('api.conversations.updateMetadata:204', () => {
        const operations = [
          {
            'operation': 'set',
            'property': 'metadata.foo',
            'value': '10'
          },
          {
            'operation': 'set',
            'property': 'metadata.bar',
            'value': {
              'user': 'fred',
              'hours': {
                'start': '9',
                'end': '5'
              }
            }
          }
        ]
        return layerIDK.api.conversations.updateMetadata(conversationId, operations)
          .then(({ status }) => {
            status.should.be.eql(204)
          })
      })
    })
  })

  describe('conversations.markAsRead', () => {
    it('should send one message', () => {
      return vcr.useCassette('api.conversations.markAsRead:send-message', () => {
        const userId = '123'
        const parts = [
          {
            mime_type: 'text/plain',
            body: 'hello world'
          }
        ]
        return layerIDK.api.messages.send(conversationId, userId, parts)
          .then(({ status }) => {
            status.should.be.eql(201)
          })
      })
    })
    it('should update conversation participants', () => {
      return vcr.useCassette('api.conversations.markAsRead:202', () => {
        const userId = '123'
        return layerIDK.api.conversations.markAsRead(conversationId, userId)
          .then(({ status }) => {
            status.should.be.eql(202)
          })
          .catch((err) => console.log(err.response))
      })
    })
  })

  describe('conversations.delete', () => {
    it('should delete conversation if exists', () => {
      return vcr.useCassette('api.conversations.delete:204', () => {
        return layerIDK.api.conversations.delete(conversationId)
          .then(({ status }) => {
            status.should.be.eql(204)
          })
      })
    })
  })
})
