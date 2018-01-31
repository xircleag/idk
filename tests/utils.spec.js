/* global describe it  */

const should = require('should')
const LayerIDK = require('../')

describe('Utils', () => {
  describe('toUUID method', function () {
    it('should return the UUID part', () => {
      const uuid = LayerIDK.toUUID('layer:///apps/staging/9ec30af8-5591-11e4-af9e-f7a201004a3b')
      uuid.should.be.eql('9ec30af8-5591-11e4-af9e-f7a201004a3b')
    })
    it('should return the UUID part if already UUID', () => {
      const uuid = LayerIDK.toUUID('9ec30af8-5591-11e4-af9e-f7a201004a3b')
      uuid.should.be.eql('9ec30af8-5591-11e4-af9e-f7a201004a3b')
    })
  })

  describe('promiseSerial method', function () {
    it('should run operations in serial fashion', (done) => {
      const items = ['one', 'two', 'three']
      const operations = items.map((item) => () => Promise.resolve(item))
      LayerIDK.promiseSerial(operations)
        .then((res) => {
          res.should.eql(['one', 'two', 'three'])
          done()
        })
        .catch(done)
    })
  })

  describe('chunkArray method', function () {
    it('should run operations in serial fashion', () => {
      const items = ['one', 'two', 'three']
      const chunks = LayerIDK.chunkArray(items, 2)
      chunks.should.eql([['one', 'two'], ['three']])
    })
  })

  describe('filterMessageParts method', function () {
    it('should return message parts matching vnd.layer.text', () => {
      const parts = [
        {
          id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
          mime_type: 'text/foo',
          body: 'This is foo message.'
        },
        {
          id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
          mime_type: 'application/vnd.layer.text+json; role=root',
          body: 'This is another text message.'
        }
      ]
      const subparts = LayerIDK.filterMessageParts(parts, { subtype: 'vnd.layer.text' })
      subparts.should.eql([
        {
          id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
          mime_type: 'application/vnd.layer.text+json; role=root',
          body: 'This is another text message.'
        }
      ])
    })
    it('should return message parts matching vnd.layer.text and role=root', () => {
      const parts = [
        {
          id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
          mime_type: 'application/vnd.layer.text+json; role=root',
          body: 'This is a text message.'
        }
      ]
      const subparts = LayerIDK.filterMessageParts(parts, { subtype: 'vnd.layer.text' }, { role: 'root' })
      subparts.should.eql([
        {
          id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
          mime_type: 'application/vnd.layer.text+json; role=root',
          body: 'This is a text message.'
        }
      ])
    })
    it('should return message parts matching vnd.layer.text and role = root', () => {
      const parts = [
        {
          id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
          mime_type: 'application/vnd.layer.text+json; role = root',
          body: 'This is a text message.'
        }
      ]
      const subparts = LayerIDK.filterMessageParts(parts, { subtype: 'vnd.layer.text' }, { role: 'root' })
      subparts.should.eql([
        {
          id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
          mime_type: 'application/vnd.layer.text+json; role = root',
          body: 'This is a text message.'
        }
      ])
    })
    it('should return no message parts matching vnd.layer.text and role=foo', () => {
      const parts = [
        {
          id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
          mime_type: 'application/vnd.layer.text+json; role=root',
          body: 'This is a text message.'
        }
      ]
      const subparts = LayerIDK.filterMessageParts(parts, { subtype: 'vnd.layer.text' }, { role: 'foo' })
      subparts.length.should.eql(0)
    })
    it('should return message parts matching vnd.layer.foo', () => {
      const parts = [
        {
          id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
          mime_type: 'application/vnd.layer.foo+json',
          body: 'This is a text message.'
        }
      ]
      const subparts = LayerIDK.filterMessageParts(parts, { subtype: 'vnd.layer.foo' })
      subparts.should.eql([
        {
          id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
          mime_type: 'application/vnd.layer.foo+json',
          body: 'This is a text message.'
        }
      ])
    })
  })

  describe('getMessageText method', function () {
    it('should return text message body', () => {
      const message = {
        parts: [
          {
            id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
            mime_type: 'text/foo',
            body: 'This message is foo.'
          },
          {
            id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
            mime_type: 'application/vnd.layer.text+json; role=root',
            body: 'This is a valid text message.'
          }
        ]
      }
      const text = LayerIDK.getMessageText(message)
      text.should.eql('This is a valid text message.')
    })
    it('should return null if no text parts found', () => {
      const message = {
        parts: [
          {
            id: 'layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0',
            mime_type: 'text/foo',
            body: 'This message is foo.'
          }
        ]
      }
      const text = LayerIDK.getMessageText(message)
      should.not.exist(text)
    })
  })
})
