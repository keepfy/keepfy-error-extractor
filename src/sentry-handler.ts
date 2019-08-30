import { ApolloError } from 'apollo-client'
import { ErrorResponse } from 'apollo-link-error'
import { ErrorMessage, SentryAdapter } from './types'

type NetworkError = {
    message?: string
    statusCode: number
    result?: {
        errors: {
            code: string
            message: string
            path?: string[]
        }[]
    }
}

const typeToCapture = [
    'UNKNOWN_ERROR',
    'SCHEMA_UNKNOWN_FIELD'
] as ErrorMessage['type'][]

const captureGQLErrors = (
    sentry: SentryAdapter,
    gqlErrors: ApolloError['graphQLErrors'],
    operationName?: string
) => {
    const title = operationName || 'GQL_UNKNOWN'
    gqlErrors.forEach(gqlError => {
        sentry.setExtras({
            Code: gqlError.code || null,
            Message: gqlError.message || null,
            Paths: (gqlError.path || []).join(',')
        })

        sentry.captureMessage(
            `${title} - ${gqlError.code}`,
            sentry.Severity.error
        )
    })
}

const captureNetworkErrors = (
    sentry: SentryAdapter,
    networkError?: NetworkError | null,
    operationName?: string
) => {
    if(!networkError) {
        return
    }

    const title = operationName || 'NETWORK_UNKNOWN'
    const { errors } = (networkError.result || { errors: [] })

    if(errors.length === 1) {
        const [error] = errors

        sentry.setExtras({
            'Network code': error.code,
            'Network message': error.message
        })
    } else {
        errors.forEach((error, index) => {
            sentry.setExtras({
                [`Network ${index} code`]: error.code,
                [`Network ${index} message`]: error.message
            })
        })
    }

    if(networkError.statusCode) {
        sentry.setExtras({
            'Status code': networkError.statusCode
        })
    }

    sentry.captureMessage(
        `${title} - Response status ${networkError.statusCode}`,
        sentry.Severity.error
    )
}

const captureIfNeeded = (sentry: SentryAdapter) => (
    mappedError: ErrorMessage,
    error: ErrorResponse
) => {
    if(!typeToCapture.includes(mappedError.type)) {
        return
    }

    // FIXME: what happens with queries with multiple operations?
    const operationName = (
        error
        && error.operation
        && error.operation.operationName
    ) || undefined

    try {
        sentry.setExtras({
            'Operation name': operationName,
            'Mapped type': mappedError.type
        })

        // We take the first one available (network or gql)
        if(error.networkError) {
            captureNetworkErrors(
                sentry,
                error.networkError as unknown as NetworkError,
                operationName
            )

            return
        }

        captureGQLErrors(
            sentry,
            error.graphQLErrors || [],
            operationName
        )
    } catch (e) {
        // Is safety never too much? ¯\_(ツ)_/¯

        sentry.captureException(e)
    }
}

export const forwardToSentry = (sentry: SentryAdapter) => ({
    captureIfNeeded: captureIfNeeded(sentry)
})
