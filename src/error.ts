import {
    AllErrorTypes,
    ExtractFromError,
    ExtractMessageFromError,
    GraphQLErrors,
    LinkErrorResponse
} from './types'

const typeFromMessage: ExtractFromError = message => {
    if (message === null) {
        return 'UNKNOWN_ERROR'
    }

    // When response body is empty
    if(message.includes('JSON parse error: Unexpected identifier')) {
        return 'UNKNOWN_ERROR'
    }

    // When we receive a xml instead of a response
    if (message.includes('Unexpected token')) {
        return 'SERVICE_OFFLINE'
    }

    if (message.includes('Network request failed')) {
        return 'CONNECTION_FAILED'
    }

    // When graphql finds a wrong field sent
    if(message.includes('Unknown argument')) {
        return 'SCHEMA_UNKNOWN_FIELD'
    }

    // Not sure if we still get this one
    if(message.includes('Access denied')) {
        return 'FORBIDDEN'
    }

    if(message.includes('Key (email)') && message.includes('already exists')) {
        return 'EMAIL_ALREADY_EXISTS'
    }

    if(message.includes('Verifique seu e-mail para acessar o sistema')) {
        return 'EMAIL_NOT_CONFIRMED'
    }

    return 'UNKNOWN_ERROR'
}

const fallbackTypes = [
    'BUSINESS_ERROR',
    'UNKNOWN_ERROR'
] as AllErrorTypes[]

export const fromGraphQLError = (graphQLErrors: GraphQLErrors[]) => {
    // Should we ignore other errors?
    const [error] = graphQLErrors

    // Fallback to message include calls
    if(fallbackTypes.includes(error.code)) {
        const properties = error.properties as
            { message?: string } | null

        const message = properties && properties.message
            ? properties.message // new format
            : error.message // old format

        /*
         * We cannot trust BUSINESS_ERROR right now
         * so we use the text mapped type
         */
        if(error.code === 'BUSINESS_ERROR') {
            return typeFromMessage(message)
        }

        return error.code
    }

    return error.code
}

export const fromApollo: ExtractMessageFromError = error => {

    if(error.networkError) {
        return typeFromMessage(error.networkError.message)

    }

    if ((error.graphQLErrors || []).length) {
        return fromGraphQLError(error.graphQLErrors as GraphQLErrors[])
    }

    return typeFromMessage(error.message)

}

export const fromResponse = (
    { graphQLErrors, networkError }: LinkErrorResponse
) => fromApollo({
    graphQLErrors: graphQLErrors || [],
    networkError: networkError || null,
    extraInfo: null,
    name: '',
    message: ''
})

