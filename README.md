# Keepfy error extractor

A package that handles keepfy specific network & graphql
errors for apollo clients

## Details

This package wraps all our logic around server error 
messages sent by keepfy backend, it maps network and
graphql errors to a known format and dispatch
it to sentry if needed.

### Install

`yarn add @keepfy/error-extractor`

### Usage

When instantiating apollo client, use it on the error
handler:

```typescript
import * as KeepfyErrorExtractor from 'keepfy-error-extractor'
import ApolloClient from 'apollo-client'


// ...
new ApolloClient({
    // ...
    onError: (error) => {
        const extracted = KeepfyErrorExtractor.extractFrom(error)
        
        if(extracted.type === 'INVALID_TOKEN'){
          // do redirect to login emit
        }
    }
    // ...

})

```


### Auto handle for sentry

You can optionally send extracted errors to sentry.


```typescript
import * as KeepfyErrorExtractor from 'keepfy-error-extractor'
import ApolloClient from 'apollo-client'

const sentryForward = KeepfyErrorExtractor.forwardToSentry(Sentry)

// ...
new ApolloClient({
    // ...
    onError: (error) => {
        const extracted = KeepfyErrorExtractor.extractFrom(error)
        
        sentryForward.captureIfNeeded(extracted, error)

        if(extracted.type === 'INVALID_TOKEN'){
          // do redirect to login emit
        }
    }
    // ...

})

```

Errors will be sent if the package decides that is needed,
for example, `UNKNOWN_ERROR` are sent to sentry but
`EMAIL_NOT_CONFIRMED` are not. You can always put your own
logic around the `captureIfNeeded` call to ignore stuff too.

Note: the handler is made for us to be able to identify
non mapped errors, so the sentry open issue has the gql 
operation name, and some details sent by backend, there's
no need to send stack traces (for now).

Note 2: we do not depend on a specific sentry package,
instead, we specify an adapter with the common sentry methods
(available at the types file, look for `SentryAdapter`), so
if your sentry passed to the forward call doesn't type check,
just write your adapter for it.
