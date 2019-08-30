import { extractMessageFromError } from './error'
import { LinkErrorResponse } from './types'
export { forwardToSentry } from './sentry-handler'

export const extract = ({ graphQLErrors, networkError }: LinkErrorResponse) =>
    extractMessageFromError({
        graphQLErrors: graphQLErrors || [],
        networkError: networkError || null,
        extraInfo: null,
        name: '',
        message: ''
    })
