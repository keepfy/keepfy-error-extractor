import { AllErrorTypes, GraphQLErrors, SuggestionsMap } from './types'
import { fromGraphQLError } from './error'

const suggestions: SuggestionsMap = {
    SERVICE_OFFLINE: {
        type: 'SERVICE_OFFLINE',
        title: 'Keepfy fora do ar',
        message: 'O serviço pode estar enfrentando problemas no momento'
    },
    CONNECTION_FAILED: {
        type: 'CONNECTION_FAILED',
        title: 'Erro de conexão',
        message: 'Não foi possível conectar-se ao keepfy'
    },
    SCHEMA_UNKNOWN_FIELD: {
        type: 'SCHEMA_UNKNOWN_FIELD',
        title: 'Erro de conexão',
        message: 'Parece que seu app pode estar desatualizado'
    },
    UNKNOWN_ERROR: {
        type: 'UNKNOWN_ERROR',
        title: 'Erro desconhecido',
        message: 'Erro não identificado, contate o administrador'
    },
    BUSINESS_ERROR: {
        type: 'BUSINESS_ERROR',
        title: 'Erro desconhecido',
        message: 'Erro não identificado, contate o administrador'
    },
    EMAIL_NOT_CONFIRMED: {
        type: 'EMAIL_NOT_CONFIRMED',
        title: 'Verificação necessária',
        message: 'Verifique seu e-mail para acessar o sistema'
    },
    AUTHENTICATION_FAILED: {
        type: 'AUTHENTICATION_FAILED',
        title: 'Ops!',
        message: 'Autenticação de usuário falhou!'
    },
    EMAIL_ALREADY_EXISTS: {
        type: 'EMAIL_ALREADY_EXISTS',
        title: 'O e-mail informado já está em uso',
        message: 'Utilize o login para acessar a sua conta.'
    },
    FORBIDDEN: {
        type: 'FORBIDDEN',
        title: 'Não autorizado',
        message: 'Você não possui permissão para realizar esta ação.'
    }
}

export const getSuggestion = (code: AllErrorTypes) =>
    suggestions[code] || suggestions[code]

export const suggestionFromGraphQLError = (graphQLErrors: GraphQLErrors[]) => {
    const type = fromGraphQLError(graphQLErrors)

    // Should we ignore other errors?
    const [error] = graphQLErrors
    const extracted = getSuggestion(type)
    const properties = error.properties as { message?: string } | null
    const message = properties && properties.message
        ? properties.message // new format
        : error.message // old format

    // See error.ts extract from apollo fn
    if(error.code === 'BUSINESS_ERROR') {
        return {
            ...extracted,
            message: message
        }
    }

    return extracted
}

