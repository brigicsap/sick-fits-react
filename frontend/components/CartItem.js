import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types'
import formatMoney from '../lib/formatMoney'
import RemoveFromCart from '../components/RemoveFromCart'

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightGrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
  }
  h3, p {
    margin: 0
  }
`

const CartItem = ({ cartItem }) => (
  <CartItemStyles>
    <img
      src={cartItem.item.image}
      alt={cartItem.item.title}
      width="100" />
    <div className="cart-item-details">
      <h3>{cartItem.item.title}</h3>
      <p>
        {formatMoney(cartItem.item.price * cartItem.quantity)}
        {' - '}
        <small>
          {cartItem.quantity} &times; {formatMoney(cartItem.item.price)} each
        </small>
      </p>
    </div>
    <RemoveFromCart id={cartItem.id}></RemoveFromCart>
  </CartItemStyles>
)

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired
}

export default CartItem