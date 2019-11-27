import { ErrorResponse } from 'apollo-link-error'
import { AllErrorTypes, KeepfyGraphQLError } from './types'
import { GraphQLError } from 'graphql'

export type Severity =
    | 'fatal'
    | 'error'
    | 'warning'
    | 'log'
    | 'info'
    | 'debug'
    | 'critical'

export type SentryAdapter = {
    captureException(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        exception: any
    ): string
    setExtras(extras: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any
    }): void
    captureMessage(
        message: string,
        level?: Severity
    ): string
}

export type NetworkError = {
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

const typeToCapture: AllErrorTypes[] = [
    'UNKNOWN_ERROR',
    'SCHEMA_UNKNOWN_FIELD',
    'INVALID_SUBSCRIPTION',
    'INVALID_INPUT'
]

const captureGQLErrors = (
    sentry: SentryAdapter,
    gqlErrors: readonly GraphQLError[] | readonly KeepfyGraphQLError[],
    operationName?: string
) => {
    const title = operationName || 'GQL_UNKNOWN'

    gqlErrors.forEach((gqlError: GraphQLError | KeepfyGraphQLError) => {
        const code = 'code' in gqlError
            ? gqlError.code
            : gqlError.name

        sentry.setExtras({
            Code: code,
            Message: gqlError.message || null,
            Paths: (gqlError.path || []).join(',')
        })

        sentry.captureMessage(
            `${title} - ${code}`,
            'error'
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
        'error'
    )
}

const captureIfNeeded = (sentry: SentryAdapter) => (
    type: AllErrorTypes,
    error: ErrorResponse
) => {
    if(!typeToCapture.includes(type)) {
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
            'Mapped type': type
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
