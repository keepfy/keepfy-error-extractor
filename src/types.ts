import { GraphQLError } from 'graphql'

export type KeepfyErrorCode =
    | 'FORBIDDEN'
    | 'AUTHENTICATION_FAILED'
    | 'INVALID_SUBSCRIPTION'
    | 'INVALID_SESSION'
    | 'EMAIL_ALREADY_EXISTS'
    | 'EMAIL_NOT_VERIFIED'
    | 'ENTITY_NOT_FOUND'
    | 'DUPLICATED_ENTITY'
    | 'ENTITY_IS_STILL_REFERENCED'
    | 'INVALID_USER_ROLE'
    | 'INACTIVE_USER'
    | 'INVALID_CREDIT_CARD'
    | 'OFFLINE_PAYMENT_SERVICE'
    | 'PAYMENT_INTEGRATION'
    | 'PAYMENT_DATA_INCONSISTENCY'
    | 'BUSINESS_ERROR'
    | 'INVALID_INPUT'
    | 'DELETED_SESSION'
    | 'MINIMUM_PASSWORD_ERROR'

export interface IKeepfyError {
    message: string
    code: KeepfyErrorCode
    isTrusted?: boolean
}

export type ClientErrorCode =
    | 'UNKNOWN_ERROR'
    | 'SCHEMA_UNKNOWN_FIELD'
    | 'CONNECTION_FAILED'

export type AllErrorTypes = KeepfyErrorCode | ClientErrorCode

export interface IKeepfyErrorTrusted {
    type: AllErrorTypes
    message: string
    isClientFault?: boolean
}

export type KeepfyGraphQLError = GraphQLError & IKeepfyError

export const defaultKeepfyErrorTrusted: IKeepfyErrorTrusted = {
    type: 'UNKNOWN_ERROR',
    message: 'Ops! Ocorreu um erro, contate o administrador'
}
