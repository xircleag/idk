## Monitoring

Logger has a built in monitoring capabilities. When enabled it will publish events **only** when `warn` and `error` log levels are triggered. It will look for service credentials present in configuration as part of [initialization](/README.md#initialization).

### PagerDuty

[PagerDuty](https://www.pagerduty.com/) service can be enabled from [layer-integrations](https://github.com/layerhq/layer-integrations) CLI:

    layer-integrations deploy --pagerduty

PagerDuty [events](https://v2.developer.pagerduty.com/docs/events-api-v2) will be sent with a `trigger` action using the following payload:

```javascript
{
  summary: 'Webhook error', // Logger message string (first parameter)
  custom_details: { // Loggger details object (second parameter)
    message: 'Cannot read property x of undefined',
    stack: 'at exports.webhook.err (/var/task/src/handlers.js:25:20)'
  },
  component: 'layer-email-fallback', // Serverless service name
  group: 'aws', // Cloud provider (aws or azure)
  source: 'layer:///apps/staging/ffffffff-ffff-ffff-ffff-ffffffffffff', // Layer app ID
  severity: 'error' // warn or error
}
```

All this information should help identify which integration triggered an alert.

### Sentry

[Sentry](https://sentry.io) service can be enabled from [layer-integrations](https://github.com/layerhq/layer-integrations) CLI:

    layer-integrations deploy --sentry
