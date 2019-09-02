import { ErrorResponse } from 'apollo-link-error'
import { ApolloError } from 'apollo-client'

export type ClientErrorTypes =
    | 'SERVICE_OFFLINE'
    | 'CONNECTION_FAILED'
    | 'UNKNOWN_ERROR'
    | 'EMAIL_NOT_CONFIRMED'
    | 'EMAIL_ALREADY_EXISTS'
    | 'SCHEMA_UNKNOWN_FIELD'

export type BackEndErrorTypes =
    | 'AUTHENTICATION_FAILED'
    | 'FORBIDDEN'
    | 'BUSINESS_ERROR' // general type, mostly ignored

export type AllErrorTypes = ClientErrorTypes | BackEndErrorTypes

export type MessageSuggestion = {
    type: AllErrorTypes
    title: string
    message: string
}

export type SuggestionsMap = {
    [key in AllErrorTypes]: MessageSuggestion & {
        type: key,
    }
}

export type GraphQLErrors = {
    code: BackEndErrorTypes
    message: string
    path: string[]
    properties: unknown
}

export type ExtractMessageFromError = (
    error: ApolloError
) => AllErrorTypes

export type ExtractFromError = (message: string | null) => AllErrorTypes

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
