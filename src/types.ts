import { ErrorResponse } from 'apollo-link-error'
import { ApolloError } from 'apollo-client'

export type ClientErrorTypes =
    | 'SERVICE_OFFLINE'
    | 'CONNECTION_FAILED'
    | 'UNKNOWN_ERROR'
    | 'EMAIL_NOT_CONFIRMED'
    | 'EMAIL_ALREADY_EXISTS'
    | 'SCHEMA_UNKNOWN_FIELD'
    | 'CANNOT_FINISH_REQUEST_WITH_ORDER'

export type BackendErrorsWithProperties = {
    ENTITY_IS_STILL_REFERENCED: {
        primaryKey: {
            [index: string]: string
        },
        entity: string,
        referencedBy: string
    },
    DUPLICATED_ENTITY: {
        keys: {
            [key: string] : string
        }
    }
}

export type BackEndErrorTypes =
    | 'AUTHENTICATION_FAILED'
    | 'FORBIDDEN'
    | 'INVALID_SESSION'
    | 'INVALID_SUBSCRIPTION'
    | 'ENTITY_NOT_FOUND'
    | 'INVALID_INPUT'
    | 'INTERNAL_SERVER_ERROR'
    | 'EMPLOYEE_INACTIVE_ON_CURRENT_BRANCH'
    | 'BUSINESS_ERROR' // general type, mostly ignored
    | keyof BackendErrorsWithProperties

export type AllErrorTypes = ClientErrorTypes | BackEndErrorTypes

export type MessageSuggestion = {
    type: AllErrorTypes
    title: string
    message: string
}

export type SuggestionsMap = {
    [key in AllErrorTypes]: MessageSuggestion & {
        type: key
    }
}

export type GraphQLError = {
    code: string
    message: string
    path: string[]
    properties: unknown
}

export type ApolloErrorWithProps = Omit<ApolloError, 'graphQLErrors'> & {
    graphQLErrors: ReadonlyArray<GraphQLError & { properties: unknown }>
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
