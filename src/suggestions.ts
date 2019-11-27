import { ApolloError } from 'apollo-client'
import {
    defaultKeepfyErrorTrusted,
    IKeepfyErrorTrusted,
    KeepfyGraphQLError
} from './types'

const clientErrorFromMessage = (message: string): IKeepfyErrorTrusted => {
    if (/(Network)?\s?(request)?\s?(failed|errors?)?/gi.test(message)) {
        return {
            type: 'CONNECTION_FAILED',
            message: 'Não foi possível conectar-se ao Keepfy'
        }
    }

    // When graphql finds a wrong field sent
    if (message.includes('Unknown argument')) {
        return {
            type: 'SCHEMA_UNKNOWN_FIELD',
            message: 'Parece que seu Keepfy pode estar desatualizado'
        }
    }

    return defaultKeepfyErrorTrusted
}

export const suggestionFromGraphQLError = (
    apolloError: ApolloError
): IKeepfyErrorTrusted => {
    const [graphqlError = null] = apolloError.graphQLErrors as KeepfyGraphQLError[]

    // only servers errors have the 'code'
    if(graphqlError?.code) {
        return {
            type: graphqlError.code,
            // if it is 'isTrusted', then it have a trusted message
            message: graphqlError.isTrusted
                ? graphqlError.message
                : defaultKeepfyErrorTrusted.message,
            isClientFault: false
        }
    }

    return {
        ...clientErrorFromMessage(apolloError.message),
        isClientFault: true
    }
}
