import {
    BackendMessagesMap,
    ErrorMessage,
    LinkErrorResponse,
    TExtractFromError,
    TExtractMessageFromError,
    TGraphQLErrors
} from './types'

const keepfyOfflineMessage: ErrorMessage = {
    type: 'SERVICE_OFFLINE',
    title: 'Keepfy fora do ar',
    text: 'O serviço pode estar enfrentando problemas no momento'
}

const keepfyConnectionFailed: ErrorMessage = {
    type: 'CONNECTION_FAILED',
    title: 'Erro de conexão',
    text: 'Não foi possível conectar-se ao keepfy'
}

const keepfyUnknownField: ErrorMessage = {
    type: 'SCHEMA_UNKNOWN_FIELD',
    title: 'Erro de conexão',
    text: 'Parece que seu app pode estar desatualizado'
}

const keepfyUnknownError: ErrorMessage = {
    type: 'UNKNOWN_ERROR',
    title: 'Erro desconhecido',
    text: 'Erro não identificado, contate o administrador'
}

const keepfyNeedEmailConfirmation: ErrorMessage = {
    type: 'EMAIL_NOT_CONFIRMED',
    title: 'Verificação necessária',
    text: 'Verifique seu e-mail para acessar o sistema'
}

const backendMessagesMap: BackendMessagesMap = {
    AUTHENTICATION_FAILED: {
        type: 'AUTHENTICATION_FAILED',
        title: 'Ops!',
        text: 'Autenticação de usuário falhou!'
    },
    FORBIDDEN: {
        type: 'FORBIDDEN',
        title: 'Não autorizado',
        text: 'Você não possui permissão para realizar esta ação.'
    }
}

const extractFromMessage: TExtractFromError = message => {
    if (message === null) {
        return keepfyUnknownError
    }

    // When response body is empty
    if(message.includes('JSON parse error: Unexpected identifier')) {
        return keepfyUnknownError
    }

    // When we receive a xml instead of a response
    if (message.includes('Unexpected token')) {
        return keepfyOfflineMessage
    }

    if (message.includes('Network request failed')) {
        return keepfyConnectionFailed
    }

    // When graphql finds a wrong field sent
    if(message.includes('Unknown argument')) {
        return keepfyUnknownField
    }

    // Not sure if we still get this one
    if(message.includes('Access denied')) {
        return backendMessagesMap['FORBIDDEN']!
    }

    if(message.includes('Verifique seu e-mail para acessar o sistema')) {
        return keepfyNeedEmailConfirmation
    }

    return {
        type: 'UNKNOWN_ERROR',
        title: 'Erro não identificado',
        text: message
    } as ErrorMessage
}

const extractFromGraphQLError = (graphQLErrors: TGraphQLErrors[]) => {
    // Should we ignore other errors?
    const [error] = graphQLErrors

    const extractedBackend = backendMessagesMap[error.code]

    // Fallback to message include calls
    if(!extractedBackend) {
        const properties = error.properties as
            { message?: string } | null

        const message = properties && properties.message
            ? properties.message // new format
            : error.message // old format

        const extracted = extractFromMessage(message)

        /*
         * We cannot trust BUSINESS_ERROR right now
         * so we use the text mapped type + the
         * backend sent message
         */
        if(error.code === 'BUSINESS_ERROR') {
            return {
                ...extracted,
                text: message
            }
        }

        return extracted
    }

    return extractedBackend
}

export const extractFromApollo: TExtractMessageFromError = error => {

    if(error.networkError) {
        return extractFromMessage(error.networkError.message)
    }

    if ((error.graphQLErrors || []).length) {
        return extractFromGraphQLError(error.graphQLErrors as TGraphQLErrors[])
    }

    return extractFromMessage(error.message)
}

export const extractFrom = (
    { graphQLErrors, networkError }: LinkErrorResponse
) => extractFromApollo({
    graphQLErrors: graphQLErrors || [],
    networkError: networkError || null,
    extraInfo: null,
    name: '',
    message: ''
})

