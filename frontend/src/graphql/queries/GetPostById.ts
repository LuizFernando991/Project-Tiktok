import { gql } from '@apollo/client'

export const GET_POST_BY_ID = gql`
  query GetPostById($id: Int!) {
    getPostById(id: $id) {
      id
      text
      video
      createdAt
      user {
        id
        email
        name
      }
      likes {
        id
        userId
        postId
      }
      otherPostIds
    }
  }
`
