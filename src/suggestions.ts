import { RawGraphQLError, SuggestionsMap } from './types'
import { fromGraphQLError } from './error'

const unknownError = {
    title: 'Erro desconhecido',
    message: 'Erro não identificado, contate o administrador'
}

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
        ...unknownError
    },
    BUSINESS_ERROR: {
        type: 'BUSINESS_ERROR',
        ...unknownError
    },
    INTERNAL_SERVER_ERROR: {
        type: 'INTERNAL_SERVER_ERROR',
        ...unknownError
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
    },
    INVALID_SESSION: {
        type: 'INVALID_SESSION',
        title: 'Conta desconectada',
        message: 'Realize novamente o seu login'
    },
    ENTITY_NOT_FOUND: {
        type: 'ENTITY_NOT_FOUND',
        title: 'Entidade não encontrada',
        message: 'Tente novamente'
    },
    INVALID_INPUT: {
        type: 'INVALID_INPUT',
        title: 'Campo inválido',
        message: 'Um ou mais campos inválidos'
    },
    INVALID_SUBSCRIPTION: {
        type: 'INVALID_SUBSCRIPTION',
        title: 'Plano não existente',
        message: 'Esta conta não possui um plano vinculado, contate o administrador'
    },
    ENTITY_IS_STILL_REFERENCED: {
        type: 'ENTITY_IS_STILL_REFERENCED',
        title: 'Entidade referenciada',
        message: 'Não é possivel realizar a operação, entidade ainda possui vínculos'
    },
    DUPLICATED_ENTITY: {
        type: 'DUPLICATED_ENTITY',
        title: 'Entidade duplicada',
        message: [
            'Um ou mais campos unicos informados',
            'ja estão cadastrados no sistema'
        ].join(' ')
    }
}

export const getSuggestion = <
    T extends keyof SuggestionsMap = keyof SuggestionsMap
>(code: T) => suggestions[code]! as SuggestionsMap[T]

export const suggestionFromGraphQLError = (
    graphQLErrors: ReadonlyArray<RawGraphQLError>
) => {
    const type = fromGraphQLError(graphQLErrors)

    // Should we ignore other errors?
    const [error] = graphQLErrors
    const extracted = getSuggestion(type)
    const properties = error.properties as { message?: string } | null
    const message = properties && properties.message
        ? properties.message // new format
        : error.message // old format

    // See error.ts extract from apollo fn
    if(message) {
        return {
            ...extracted,
            message
        }
    }

    return extracted
}
