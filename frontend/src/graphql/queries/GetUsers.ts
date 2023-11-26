import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query GetUsers($take: Int!) {
    getUsers(take: $take) {
      id
      name
      email
      image
    }
  }
`
