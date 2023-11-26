import { gql } from '@apollo/client'

export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    register(
      registerInput: { name: $name, email: $email, password: $password }
    ) {
      user {
        email
        id
        name
      }
    }
  }
`
