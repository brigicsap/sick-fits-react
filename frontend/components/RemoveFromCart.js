import React from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import { CURRENT_USER_QUERY } from '../components/User'
import styled from 'styled-components'

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled.div`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.red};
  }
`

class RemoveFromCart extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  //gets called as soon as we get a response back after a mutation has been performed
  // cache => apollo cache
  // payload => server response
  update = (cache, payload) => {
    // read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY })
    // remove item from the cart
    const cartItemId = payload.data.removeFromCart.id
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)
    // write it back to cache
    // writeQuery only changes data locally
    cache.writeQuery({ query: CURRENT_USER_QUERY, data })
  }

  // optimisticResponse => for instant UI updates
  // when we delete an item, it's gonna immediately reply with the info provided in the object, assuming that that's the response from the actual mutation and the actual mutation will run in the background
  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{
          id: this.props.id
        }}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: this.props.id
          }
        }}
        refetchQueries={[
          { query: CURRENT_USER_QUERY }
        ]}
      >
        {(removeFromCart, { loading, error }) => (
          <BigButton
            title="Delete Item"
            disabled={loading}
            onClick={() => removeFromCart().catch(err => alert(err.message))}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    )
  }
}

export default RemoveFromCart
