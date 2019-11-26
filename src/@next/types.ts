import { ApolloError } from "apollo-client"

export type PaymentErrorCode =
    | 'INVALID_CREDIT_CARD'
    | 'OFFLINE_PAYMENT_SERVICE'
    | 'PAYMENT_INTEGRATION'
    | 'PAYMENT_DATA_INCONSISTENCY'

export type DataBaseEntityErrorCode =
    | 'ENTITY_NOT_FOUND'
    | 'DUPLICATED_ENTITY'
    | 'ENTITY_IS_STILL_REFERENCED'

export type KeepfyErrorCode =
    | 'FORBIDDEN'
    | 'AUTHENTICATION_FAILED'
    | 'INVALID_SUBSCRIPTION'
    | 'INVALID_SESSION'
    | 'EMAIL_ALREADY_EXISTS'
    | 'EMAIL_NOT_CONFIRMED'
    | PaymentErrorCode
    | DataBaseEntityErrorCode
    | 'INVALID_USER_ROLE'
    | 'INACTIVE_USER'
    | 'BUSINESS_ERROR'
    | 'INVALID_INPUT'

export interface KeepfyError extends ApolloError {
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

export interface KeepfyErrorTrusted {
    type: AllErrorTypes
    message: string
}

export const defaultKeepfyErrorTrusted: KeepfyErrorTrusted = {
    type: 'UNKNOWN_ERROR',
    message: 'Ops! Ocorreu um erro, contate o administrador'
}