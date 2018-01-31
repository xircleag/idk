/* global describe it */
'use strict'

const vcr = require('nock-vcr-recorder')
vcr.config({ cassetteLibraryDir: 'tests/api/cassetes' })

const config = require('../resources/layer_config.json')
const seed = require('./seed.json')

const LayerIDK = require('../../')
const layerIDK = new LayerIDK(config)

describe('API', () => {
  // user has to join this conversation first
  describe('messages.send', () => {
    it('should return 201', () => {
      return vcr.useCassette('api.messages.send:201', () => {
        const parts = [
          {
            mime_type: 'text/plain',
            body: 'hello world'
          }
        ]
        return layerIDK.api.messages.send(seed.conversation_id, seed.user_id, parts)
          .then(({ status, data }) => {
            status.should.be.eql(201)
            data.should.have.properties(['id', 'url', 'conversation', 'parts', 'sent_at', 'sender', 'recipient_status'])
          })
      })
    })
  })

  describe('messages.getAll', () => {
    it('should return 200', () => {
      return vcr.useCassette('api.messages.getAll:200', () => {
        return layerIDK.api.messages.getAll(seed.conversation_id)
          .then(({ status, data }) => {
            status.should.be.eql(200)
          })
      })
    })
  })

  describe('messages.get', () => {
    it('should return 200', () => {
      return vcr.useCassette('api.messages.get:200', () => {
        const messageId = 'layer:///messages/f3e5f2b7-6086-4866-a42b-dec15bc53d5c'
        return layerIDK.api.messages.get(seed.conversation_id, messageId)
          .then(({ status, data }) => {
            status.should.be.eql(200)
          })
      })
    })
  })

  describe('messages.addPart', () => {
    it('should return 201', () => {
      return vcr.useCassette('api.messages.addPart:201', () => {
        const messageId = 'layer:///messages/f3e5f2b7-6086-4866-a42b-dec15bc53d5c'
        const part = {
          mime_type: 'text/plain',
          body: 'hello world'
        }
        return layerIDK.api.messages.addPart(seed.conversation_id, messageId, part)
          .then(({ status, data }) => {
            status.should.be.eql(201)
          })
      })
    })
  })

  describe('messages.getParts', () => {
    it('should return parts', () => {
      return vcr.useCassette('api.messages.getParts:200', () => {
        const messageId = 'layer:///messages/f3e5f2b7-6086-4866-a42b-dec15bc53d5c'
        const part = {
          mime_type: 'text/plain',
          body: 'hello world'
        }
        return layerIDK.api.messages.addPart(seed.conversation_id, messageId, part)
          .then(({ status, data }) => {
            return layerIDK.api.messages.getParts(seed.conversation_id, messageId)
              .then(({ status, data }) => {
                status.should.be.eql(200)
              })
          })
      })
    })
  })

  describe('messages.getPart', () => {
    it('should return part', () => {
      return vcr.useCassette('api.messages.getPart:200', () => {
        const messageId = 'layer:///messages/f3e5f2b7-6086-4866-a42b-dec15bc53d5c'
        const part = {
          mime_type: 'text/plain',
          body: 'hello world'
        }
        return layerIDK.api.messages.addPart(seed.conversation_id, messageId, part)
          .then(({ status, data }) => {
            return layerIDK.api.messages.get(seed.conversation_id, messageId)
              .then(({ status, data }) => {
                const parts = data.parts
                const partId = parts[0].id
                return layerIDK.api.messages.getPart(seed.conversation_id, messageId, partId)
                  .then(({ status, data }) => {
                    status.should.be.eql(200)
                  })
              })
          })
      })
    })
  })

  describe('messages.updatePart', () => {
    it('should update part', () => {
      return vcr.useCassette('api.messages.updatePart:200', () => {
        const messageId = 'layer:///messages/f3e5f2b7-6086-4866-a42b-dec15bc53d5c'
        const part = {
          mime_type: 'text/plain',
          body: 'hello world'
        }
        return layerIDK.api.messages.addPart(seed.conversation_id, messageId, part)
          .then(({ status, data }) => {
            return layerIDK.api.messages.get(seed.conversation_id, messageId)
              .then(({ status, data }) => {
                const parts = data.parts
                const partId = parts[0].id
                const updatedPart = {
                  mime_type: 'text/plain',
                  body: 'UPDATED hello world'
                }
                return layerIDK.api.messages.updatePart(seed.conversation_id, messageId, partId, updatedPart)
                  .then(({ status, data }) => {
                    status.should.be.eql(200)
                    data.body.should.be.eql(updatedPart.body)
                  })
              })
          })
      })
    })
  })

  describe('messages.replaceParts', () => {
    it('should replace part', () => {
      return vcr.useCassette('api.messages.replaceParts:200', () => {
        const messageId = 'layer:///messages/f3e5f2b7-6086-4866-a42b-dec15bc53d5c'
        const part = {
          mime_type: 'text/plain',
          body: 'hello world'
        }
        return layerIDK.api.messages.addPart(seed.conversation_id, messageId, part)
          .then(({ status, data }) => {
            const parts = [{
              mime_type: 'text/plain',
              body: 'hello world 1'
            }, {
              mime_type: 'text/plain',
              body: 'hello world 2'
            }, {
              mime_type: 'text/plain',
              body: 'hello world 3'
            }]
            return layerIDK.api.messages.replaceParts(seed.conversation_id, messageId, parts)
              .then(({ status, data }) => {
                status.should.be.eql(200)
                return layerIDK.api.messages.getParts(seed.conversation_id, messageId)
                  .then(({ status, data }) => {
                    const parts = data
                    parts.length.should.be.eql(parts.length)
                    parts[0].body.should.be.eql(parts[0].body)
                    parts[1].body.should.be.eql(parts[1].body)
                    parts[2].body.should.be.eql(parts[2].body)
                  })
              })
          })
      })
    })
  })

  describe('messages.deletePart', () => {
    it('should delete part', () => {
      return vcr.useCassette('api.messages.deletePart:200', () => {
        const messageId = 'layer:///messages/f3e5f2b7-6086-4866-a42b-dec15bc53d5c'
        const part = {
          mime_type: 'text/plain',
          body: 'hello world'
        }
        return layerIDK.api.messages.addPart(seed.conversation_id, messageId, part)
          .then(({ status, data }) => {
            return layerIDK.api.messages.getParts(seed.conversation_id, messageId)
              .then(({ status, data }) => {
                const parts = data
                const lastPart = parts[parts.length - 1]
                return layerIDK.api.messages.deletePart(seed.conversation_id, messageId, lastPart.id)
                  .then(({ status, data }) => {
                    status.should.be.eql(204)
                  })
              })
          })
      })
    })
  })

  describe('messages.delete', () => {
    it('should delete the message', () => {
      return vcr.useCassette('api.messages.delete:200', () => {
        const parts = [
          {
            mime_type: 'text/plain',
            body: 'hello world'
          }
        ]
        return layerIDK.api.messages.send(seed.conversation_id, seed.user_id, parts)
          .then(({ status, data }) => {
            const messageId = data.id
            return layerIDK.api.messages.delete(seed.conversation_id, messageId)
              .then(({ status, data }) => {
                status.should.be.eql(204)
              })
          })
      })
    })
  })
})
