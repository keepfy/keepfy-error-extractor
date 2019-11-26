import { ApolloError } from 'apollo-client'

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

export interface IKeepfyError extends ApolloError {
    message: string
    code: KeepfyErrorCode
    isNext: boolean | undefined
}

export type ClientErrorCode =
    | 'UNKNOWN_ERROR'
    | 'SCHEMA_UNKNOWN_FIELD'
    | 'CONNECTION_FAILED'
    | 'SERVICE_OFFLINE'

export type AllErrorTypes = KeepfyErrorCode | ClientErrorCode

export interface IKeepfyErrorTrusted {
    type: AllErrorTypes
    message: string
}

export const defaultKeepfyErrorTrusted: IKeepfyErrorTrusted = {
    type: 'UNKNOWN_ERROR',
    message: 'Ops! Ocorreu um erro, contate o administrador'
}
