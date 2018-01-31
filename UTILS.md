## Utils

These are the utility functions exposed statically via `LayerIDK` class.

### .toUUID(id)

Convert any Layer ID which is usually prefixed with `layer:///` to UUID.

- `id` - Layer ID

#### Example

```javascript
const messageUUID = LayerIDK.toUUID('layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff')
// 'ffffffff-ffff-ffff-ffff-ffffffffffff'
```

### .toLayerPrefix(id)

Add Layer prefix to any plain ID.

- `type` - Layer prefix type e.g. `conversations`, `messages`, etc.
- `uuid` - Plain UUID

#### Example

```javascript
const messageUUID = LayerIDK.toLayerPrefix('messages', 'ffffffff-ffff-ffff-ffff-ffffffffffff')
// 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff'
```

### .promiseSerial(operations)

Execute an array of promises in a serial fashion and return an array of results.

- `operations` - An array of functions that returns a Promise

#### Example

```javascript
const operations = [
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.resolve(3)
]

LayerIDK.promiseSerial(operations)
  .then((res) => {
    // [1, 2, 3]
  })
  .catch(console.error)
```

### .chunkArray(array, chunks)

Split up an array into chunks returing an array of arrays.

- `array` - An array
- `chunks` - Number of chunks

#### Example

```javascript
const array = [1, 2, 3, 4, 5]
const chunked = LayerIDK.chunkArray(array, 2)
// [[1, 2], [3, 4], [5]]
```

### .filterMessageParts(parts, media, parameters)

Filter array of message parts based on mime type subtype and optional mime_type parameters. Using [media-type](https://github.com/lovell/media-type) library for parsing.

- `parts` - An array of message parts
- `media` - Mime type media hash
  - `media.subtype` - Media subtype
  - `media.type` - *Optional* Media type (defaults to 'application')
  - `media.suffix` *Optional* Media suffix (defaults to 'json')
- `parameters` - *Optional* hash of mime type parameters to match

#### Example

```javascript
const parts = [
  {
    mime_type: 'application/vnd.layer.foo+json',
    body: 'Hello foo'
  },
  {
    mime_type: 'application/vnd.layer.text+json; role=root',
    body: 'Hello world'
  }
]
const media = { subtype: 'vnd.layer.text' }
const parameters = { role: 'root' }

const parts = LayerIDK.filterMessageParts(parts, media, parameters)
// [{ mime_type: 'application/vnd.layer.text+json; role=root', body: 'Hello world' }]
```


### .getMessageText(message)

Return text from message object that matches the message part mime type according to Layer XDK framework.

- `message` - Layer Message object

#### Example

```javascript
const message = {
  id: 'layer:///messages/ffffffff-ffff-ffff-ffff-ffffffffffff',
  parts: [
    {
      mime_type: 'application/vnd.layer.text+json; role=root',
      body: 'Hello world'
    }
  ]
}

const text = LayerIDK.getMessageText(message)
// 'Hello world'
```
