'use strict'

const fs = require('fs')

const config = require('../resources/layer_config.json')
const LayerIDK = require('../../')
const layerIDK = new LayerIDK(config)

if (!process.argv[2]) {
  throw new Error('Missing Layer user ID parameter')
}

const SEED = {
  user_id: process.argv[2]
}

function createIdentity () {
  return layerIDK.api.identities.create(SEED.user_id, {
    user_id: SEED.user_id,
    display_name: 'IDK test user'
  })
}

function createConversation () {
  const participants = [SEED.user_id]
  return layerIDK.api.conversations.create(participants)
}

function sendMessage () {
  const parts = [
    {
      mime_type: 'text/plain',
      body: 'hello world'
    }
  ]
  return layerIDK.api.messages.send(SEED.conversation_id, SEED.user_id, parts)
}

function seed () {
  createIdentity()
    .then(createConversation)
    .then(({ data }) => {
      SEED.conversation_id = data.id
      return sendMessage()
    })
    .then(() => {
      fs.writeFileSync('tests/api/seed.json', JSON.stringify(SEED, null, '\t'))
      console.log('Run `npm run test:cleanup` and then `npm test`.')
    })
    .catch(console.error)
}

layerIDK.api.identities.get(SEED.user_id)
  .then(() => {
    console.error(`Test user "${SEED.user_id}"" already exists. Change it and seed again.`)
  })
  .catch(seed)
