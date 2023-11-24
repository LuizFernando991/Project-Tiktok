import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  Observable,
  ApolloLink
} from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { onError } from '@apollo/client/link/error'

async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RefreshToken {
          accessToken
        }
      `
    })

    const newAccessToken = data?.accessToken

    if (!newAccessToken) throw new Error('New access token not received.')

    localStorage.setItem('accessToken', newAccessToken)
    return `Bearer ${newAccessToken}`
  } catch (err) {
    throw new Error('Error getting new access token')
  }
}

let retryCount = 0
const maxRetry = 3

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions.code === 'UNAUTHENTICATED' && retryCount < maxRetry) {
        retryCount++
        return new Observable((observer) => {
          refreshToken(client)
            .then((token) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              operation.setContext((previousContext: any) => ({
                headers: {
                  ...previousContext.headers,
                  authorization: token
                }
              }))
              const forward$ = forward(operation)
              forward$.subscribe(observer)
            })
            .catch((err) => observer.error(err))
        })
      }
    }
  }
})

const uploadLink = createUploadLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  credentials: 'include',
  headers: {
    'apollo-require-preflight': 'true'
  }
})

export const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getCommentsByPostId: {
            merge(_, incoming) {
              return incoming
            }
          }
        }
      }
    }
  }),
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  link: ApolloLink.from([errorLink, uploadLink])
})
