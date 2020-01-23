import { gql } from 'apollo-boost'

export const communEmotions = gql`
  query communEmotions($ids: [ID!], $limit: Int, $page: Int) {
    communEmotions(ids: $ids, limit: $limit, page: $page) {
      id complexite
      couleurDebut couleurFin
      description
      nbPoint slug titre transition 
    }
  }
`
