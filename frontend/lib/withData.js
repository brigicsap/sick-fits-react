// HOC that exposes the apollo client via a prop
import withApollo from 'next-with-apollo'
// adds basic needed setup for apollo client
import ApolloClient from 'apollo-boost'
import { endpoint } from '../config'

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          // @TODO - set this to include
          credentials: 'omit'
        },
        headers
      })
    }
  })
}

export default withApollo(createClient)
