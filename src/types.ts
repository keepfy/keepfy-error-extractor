import { ErrorResponse } from 'apollo-link-error'
import { ApolloError } from 'apollo-client'

export type ClientErrorTypes =
    | 'SERVICE_OFFLINE'
    | 'CONNECTION_FAILED'
    | 'UNKNOWN_ERROR'
    | 'EMAIL_NOT_CONFIRMED'
    | 'SCHEMA_UNKNOWN_FIELD'

export type BackEndErrorTypes =
    | 'AUTHENTICATION_FAILED'
    | 'FORBIDDEN'
    | 'BUSINESS_ERROR' // general type, mostly ignored

export type BackendMessagesMap = {
    [key in BackEndErrorTypes]?: ErrorMessage & {
        type: key
    }
}
export type ErrorMessage = {
    type: ClientErrorTypes | BackEndErrorTypes
    title: string
    text: string
}

export type TGraphQLErrors = {
    code: BackEndErrorTypes
    message: string
    path: string[]
    properties: unknown
}

export type TExtractMessageFromError = (
    error: ApolloError
) => ErrorMessage

export type TExtractFromError = (message: string | null) => ErrorMessage

export type LinkErrorResponse = ErrorResponse

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
