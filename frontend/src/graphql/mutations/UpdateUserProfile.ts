import { gql } from '@apollo/client'

export const UPDATE_PROFILE = gql`
  mutation UpdateUserProfile($name: String!, $bio: String!, $image: Upload) {
    updateUserProfile(name: $name, bio: $bio, image: $image) {
      id
      name
      bio
      image
    }
  }
`
