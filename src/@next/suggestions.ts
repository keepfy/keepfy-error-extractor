import { ApolloError } from 'apollo-client'
import { KeepfyError, KeepfyErrorTrusted, defaultKeepfyErrorTrusted } from './types'

const clientErrorFromMessage = (message: string): KeepfyErrorTrusted => {
    if (message.includes('Unexpected token')) {
        return {
            type: 'SERVICE_OFFLINE',
            message: 'O serviço pode estar enfrentando problemas no momento'
        }
    }

    if (message.includes('Network request failed')) {
        return {
            type: 'CONNECTION_FAILED',
            message: 'Não foi possível conectar-se ao keepfy'
        }
    }

    // When graphql finds a wrong field sent
    if (message.includes('Unknown argument')) {
        return {
            type: 'SCHEMA_UNKNOWN_FIELD',
            message: 'Parece que seu app pode estar desatualizado'
        }
    }

    return defaultKeepfyErrorTrusted
}

export const suggestionFromGraphQLError = (
    graphQLError: ApolloError
): KeepfyErrorTrusted => {

    if ('isTrusted' in graphQLError) {
        const keepfyError = graphQLError as KeepfyError

        return {
            type: keepfyError.code,
            message: keepfyError.message
        }
    }

    return clientErrorFromMessage(graphQLError.message)
}
