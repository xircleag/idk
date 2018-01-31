# Layer IDK
[![Build Status](https://circleci.com/gh/layerhq/idk.png?circle-token=6240fae3391dc4c5e37b06ef8494c9dd47350d07)](https://circleci.com/gh/layerhq/idk)

This is a Node.js library that is designed to be used with Layer [Integration Development Kit](https://preview-docs.layer.com/reference/integrations/framework) (IDK).

It provides common functionality for validating & processing Layer [Webhooks](https://docs.layer.com/reference/webhooks/introduction) and access to common Layer [Server API](https://docs.layer.com/reference/server_api/introduction) operations.

## Initialization

To use this library you need to pass configuration object into the constructor. Configuration object should be a `layer_config.json` file which is a part of Layer Integration Development Kit.

```javascript
const LayerIDK = require('@layerhq/idk')
const config = require('./layer_config.json')

const layerIDK = new LayerIDK(config)
```

Configuration file is generated buy a Layer Integrations command line tool. At a minimum config JSON has the following format:
```json
{
  "app_id": "layer:///apps/staging/ffffffff-ffff-ffff-ffff-ffffffffffff",
  "webhook": {
    "secret": "supersecret",
    "events": ["Message.created"]
  },
  "api": {
    "token": "abcdefg"
  }
}
```

## Webhook

Every integration is powered by a Layer Webhook which is registered to listen for a set of events in an application.

### `.webhook(headers, body)`

Validate and process a webhook by passing in HTTP `headers` object and POST request `body`. This is a synchronous function which will return webhook payload or throw an error that needs to be captured and handled.

#### Arguments

- `headers` - Webhook HTTP headers
- `body` - Webhook HTTP request body as a JSON string


#### Example

```javascript
try {
  const webhook = layerIDK.webhook(headers, body)
  // webhook payload
} catch (err) {
  console.error(err)
}
```

## Logger

We provide a logger interface to unify log severity levels, abstract some of the Cloud Provider specific functionality and enable optional monitoring capabilities.

### `.logger(context)`

Get logger interface by passing in the cloud function `context ` object.

#### Arguments

- `context` - Cloud function context object (AWS or Azure)

#### Example

```javascript
const log = layerIDK.logger(context)

log.info('Hello world', { foo: 'bar' })
log.error('Error', new Error('Oops'))
```

Available levels: `debug`, `info`, `warn`, `error`, `none`. Every level accepts the following function parameters: `(message, object)`

> You can set log level by setting `LOG_LEVEL=error` env variable.

#### Monitoring

Logger has a built in monitoring capabilities using PagerDuty. Read about [monitoring here](./MONITORING.md).

## API

Access common Layer Server API operations via `.api` namespace. Read [API documentation here](./API.md).

## Utils

These are the utility functions exposed statically via `LayerIDK` class. Read [documentation here](./UTILS.md).

## AWS Example

The following example shows how to use Amazon AWS [API Gateway](https://serverless.com/framework/docs/providers/aws/events/apigateway/) inside your Serverless handler.

```javascript
const LayerIDK = require('@layerhq/idk')
const config = require('./layer_config.json')

const layerIDK = new LayerIDK(config)

exports.webhook = (event, context, callback) => {
  const log = layerIDK.logger(contex)

  try {
    const webhook = layerIDK.webhook(event.headers, event.body)
    // webhook payload

    log.info('Webhook:', webhook)
    callback(null, { statusCode: 200 })
  } catch (err) {
    log.error('Webhook:', err)
    callback(err)
  }
}
```
