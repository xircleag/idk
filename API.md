## API

Access common [Layer Server API](https://docs.layer.com/reference/server_api/introduction) operations via `.api` namespace. All the operations are asynchronous and return a Promise that needs to be handled.

The response schema contains the following information:

```js
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200
}
```

### conversations.create(participants, metadata, distinct)

Create a new conversation.

- `participants` - Array of user IDs
- `metadata` - *Optional* Metadata object
- `distinct` - *Optional* Distinct boolean

#### Example

```js
const participants = ['user1']
layerIDK.api.conversations.create(participants)
  .then(() => {
    // conversation created
  })
```

### conversations.get(conversationId)

Fetch a conversation.

- `conversationId` - Conversation ID

#### Example

```js
const conversationId = 'layer:///conversations/ffffffff-ffff-ffff-ffff-ffffffffffff'
layerIDK.api.conversations.get(conversationId)
  .then(({ data }) => {
    console.log('conversation', data)
  })
```

### conversations.delete(conversationId)

Delete a conversation.

- `conversationId` - Conversation ID

#### Example

```js
const conversationId = 'layer:///conversations/ffffffff-ffff-ffff-ffff-ffffffffffff'
layerIDK.api.conversations.delete(conversationId)
  .then(() => {
    // conversation deleted
  })
```

### conversations.addParticipants(conversationId, participants)

Add one or more participants to a conversation.

- `conversationId` - Conversation ID
- `participants` - Array or participant user IDs

#### Example

```js
const participants = ['user2', 'user3']
layerIDK.api.conversations.addParticipants(conversationId, participants)
  .then(() => {
    // participants added
  })
```

### conversations.removeParticipants(conversationId, participants)

Remove one or more participants to a conversation.

- `conversationId` - Conversation ID
- `participants` - Array or participant user IDs

#### Example

```js
const participants = ['user3']
layerIDK.api.conversations.removeParticipants(conversationId, participants)
  .then(() => {
    // participants added
  })
```

### conversations.updateMetadata(conversationId, operations)

Update conversation metadata.

- `conversationId` - Conversation ID
- `operations` - Array of [Layer Patch](https://github.com/layerhq/layer-patch) operations

#### Example

```js
const operations = [{
  'operation': 'set',
  'property': 'metadata.foo',
  'value': 'bar'
}]
layerIDK.api.conversations.updateMetadata(conversationId, operations)
  .then(() => {
    // metadata updated
  })
```

### conversations.markAsRead(conversationId, userId, position)

Mark all messages as read in a conversation.

- `conversationId` - Conversation ID
- `userId` - User ID
- `position` - *Optional* Message position

#### Example

```js
const userId = 'user1'
layerIDK.api.conversations.markAsRead(conversationId, userId)
  .then(() => {
    // marked as read
  })
```

### messages.send(conversationId, userId, parts)

Send a message in a conversation.

- `conversationId` - Conversation ID
- `userId` - User ID
- `parts` - Array of message parts

#### Example

```js
const userId = 'layer:///identities/ffffffff-ffff-ffff-ffff-ffffffffffff'
const parts = [{
  mime_type: 'plain/text',
  body: 'Hello world'
}]
layerIDK.api.messages.send(conversationId, userId, parts)
  .then(({ data }) => {
    console.log('message', data)
  })
```

### messages.get(conversationId, messageId)

Fetch a message in a conversation.

- `conversationId` - Conversation ID
- `messageId` - Message ID

#### Example

```js
const messageId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff'
layerIDK.api.messages.get(conversationId, messageId)
  .then(({ data }) => {
    console.log('message', data)
  })
```

### messages.getAll(conversationId)

Fetch all messages in a conversation.

- `conversationId` - Conversation ID

#### Example

```js
layerIDK.api.messages.getAll(conversationId)
  .then(({ data }) => {
    console.log('messages', data)
  })
```

### messages.getParts(conversationId, messageId)

Fetch all message parts in a conversation.

- `conversationId` - Conversation ID
- `messageId` - Message ID

#### Example

```js
const messageId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff'
layerIDK.api.messages.getParts(conversationId, messageId)
  .then(({ data }) => {
    console.log('message parts', data)
  })
```

### messages.getPart(conversationId, messageId, partId)

Fetch a single message part in a conversation.

- `conversationId` - Conversation ID
- `messageId` - Message ID
- `partId` - Message part ID

#### Example

```js
const messageId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff'
const partId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff/parts/0'
layerIDK.api.messages.getPart(conversationId, messageId, partId)
  .then((part) => {
    console.log('message part', data)
  })
```

### messages.addPart(conversationId, messageId, part)

Add a new part to a message in a conversation.

- `conversationId` - Conversation ID
- `messageId` - Message ID
- `part` - Message part object

#### Example

```js
const messageId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff'
const part = {
  mime_type: 'plain/text',
  body: 'Hello world'
}
layerIDK.api.messages.addPart(conversationId, messageId, part)
  .then(() => {
    // message part added
  })
```

### messages.updatePart(conversationId, messageId, partId, part)

Update existing message part in a conversation.

- `conversationId` - Conversation ID
- `messageId` - Message ID
- `partId` - Message part ID
- `part` - Message part object

#### Example

```js
const messageId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff'
const partId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff/parts/0'
const part = {
  mime_type: 'plain/text',
  body: 'Hello world'
}
layerIDK.api.messages.updatePart(conversationId, messageId, partId, part)
  .then(() => {
    // message part updated
  })
```

### messages.replaceParts(conversationId, messageId, part)

Replace all message parts.

- `conversationId` - Conversation ID
- `messageId` - Message ID
- `parts` - Array of message parts

#### Example

```js
const messageId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff'
const parts = [{
  mime_type: 'plain/text',
  body: 'Hello world'
}]
layerIDK.api.messages.replaceParts(conversationId, messageId, parts)
  .then(() => {
    // message parts replaced
  })
```

### messages.deletePart(conversationId, messageId, partId)

Delete a single message part in a conversation.

- `conversationId` - Conversation ID
- `messageId` - Message ID
- `partId` - Message part ID

#### Example

```js
const messageId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff'
const partId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff/parts/0'
layerIDK.api.messages.deletePart(conversationId, messageId, partId)
  .then(() => {
    // message part deleted
  })
```

### messages.delete(conversationId, messageId)

Delete a message in a conversation.

- `conversationId` - Conversation ID
- `messageId` - Message ID

#### Example

```js
const messageId = 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff'
layerIDK.api.messages.delete(conversationId, messageId)
  .then(() => {
    // message deleted
  })
```

### identities.create(userId, identity)

Create a new identity.

- `userId` - User ID
- `identity` - User identity object

#### Example

```js
const userId = 'layer:///identities/ffffffff-ffff-ffff-ffff-ffffffffffff'
const identity = {
  display_name: 'Foo Bar'
}
layerIDK.api.identities.create(userId, identity)
  .then(() => {
    // identity created
  })
```

### identities.get(userId)

Fetch an identity.

- `userId` - User ID

#### Example

```js
const userId = 'layer:///identities/ffffffff-ffff-ffff-ffff-ffffffffffff'
layerIDK.api.identities.get(userId)
  .then(({ data }) => {
    console.log('identity', data)
  })
```

### identities.update(userId, identity)

Update identity object.

- `userId` - User ID
- `identity` - Identity object

#### Example

```js
const userId = 'layer:///identities/ffffffff-ffff-ffff-ffff-ffffffffffff'
const identity = {
  email: 'foo@bar.com'
}
layerIDK.api.identities.update(userId, identity)
  .then(() => {
    // identity updated
  })
```

### identities.replace(userId, identity)

Replace entire identity object.

- `userId` - User ID
- `identity` - Identity object

#### Example

```js
const userId = 'layer:///identities/ffffffff-ffff-ffff-ffff-ffffffffffff'
const identity = {
  display_name: 'Foo Bar New'
}
layerIDK.api.identities.replace(userId, identity)
  .then(() => {
    // identity replaced
  })
```

### identities.delete(userId)

Delete an identity.

- `userId` - User ID

#### Example

```js
const userId = 'layer:///identities/ffffffff-ffff-ffff-ffff-ffffffffffff'
layerIDK.api.identities.delete(userId)
  .then(() => {
    // identity deleted
  })
```
