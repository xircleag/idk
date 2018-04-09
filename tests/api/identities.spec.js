/* global describe it */
'use strict'

const vcr = require('nock-vcr-recorder')
vcr.config({ cassetteLibraryDir: 'tests/api/cassetes' })

const config = require('../resources/layer_config.json')
const seed = require('./seed.json')

const LayerIDK = require('../../')
const layerIDK = new LayerIDK(config)

const NEW_USER = `${seed.user_id}-new`

describe('API', () => {
  describe('identities.create', () => {
    it('should return 201 with no body', () => {
      return vcr.useCassette('api.identities.create_201', () => {
        const identity = {
          user_id: NEW_USER,
          display_name: 'IDK test user new',
          metadata: {
            foo: 'bar'
          }
        }
        return layerIDK.api.identities.create(NEW_USER, identity)
          .then(({ status }) => {
            status.should.be.eql(201)
          })
      })
    })
  })

  describe('identities.get', () => {
    it('should return identity object', () => {
      return vcr.useCassette('api.identities.get_200', () => {
        return layerIDK.api.identities.get(NEW_USER)
          .then(({ status, data }) => {
            status.should.be.eql(200)

            data.should.have.properties(['id', 'avatar_url', 'email_address', 'first_name', 'last_name', 'phone_number', 'public_key', 'url'])

            data.identity_type.should.eql('user')
            data.user_id.should.eql(NEW_USER)
            data.display_name.should.eql('IDK test user new')
            data.metadata.should.eql({ foo: 'bar' })
          })
      })
    })
  })

  describe('identities.update', () => {
    it('should return 204 with no body', () => {
      return vcr.useCassette('api.identities.update_204', () => {
        const identity = {
          display_name: 'IDK Test User Name Updated',
          metadata: {
            foo: 'bar2'
          }
        }
        return layerIDK.api.identities.update(NEW_USER, identity)
          .then(({ status }) => {
            status.should.be.eql(204)
          })
      })
    })
  })

  describe('identities.replace', () => {
    it('should return 204', () => {
      return vcr.useCassette('api.identities.replace_204', () => {
        const TEST_USER = 'another_test_user'
        const identity = {
          user_id: TEST_USER,
          display_name: 'IDK test user new',
          metadata: {
            foo: 'bar'
          }
        }
        return layerIDK.api.identities.create(TEST_USER, identity)
          .then(() => {
            const updatedIdentity = {
              display_name: 'IDK Test User Name Updated',
              metadata: {
                foo: 'bar2'
              }
            }
            return layerIDK.api.identities.replace(TEST_USER, updatedIdentity)
              .then(({ status }) => {
                status.should.be.eql(204)
              })
          })
      })
    })
  })

  describe('identities.delete', () => {
    it('should return 204', () => {
      return vcr.useCassette('api.identities.delete_204', () => {
        const TEST_USER = 'another_test_user_1'
        const identity = {
          user_id: TEST_USER,
          display_name: 'IDK test user new',
          metadata: {
            foo: 'bar'
          }
        }
        return layerIDK.api.identities.create(TEST_USER, identity)
          .then(() => {
            return layerIDK.api.identities.delete(TEST_USER)
              .then(({ status }) => {
                status.should.be.eql(204)
              })
          })
      })
    })
  })
})
