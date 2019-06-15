// HOC that exposes the apollo client via a prop
import withApollo from 'next-with-apollo'
// adds basic needed setup for apollo client
import ApolloClient from 'apollo-boost'
import { endpoint } from '../config'
import { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION } from '../components/Cart'

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include'
        },
        headers
      })
    },
    // local data
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            // read the cartOpen value from cache
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY
            })
            //write card state to the opposite
            const data = {
              data: { cartOpen: !cartOpen }
            }
            cache.writeData(data)
            return data
          }
        }
      },
      defaults: {
        cartOpen: true
      }
    }
  })
}

export default withApollo(createClient)
