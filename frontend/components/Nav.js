import Link from 'next/link'
import { Mutation } from 'react-apollo'
import NavStyles from './styles/NavStyles'
import User from '../components/User'
import Signout from '../components/Signout'
import CartCount from '../components/CartCount'
import { TOGGLE_CART_MUTATION } from '../components/Cart'

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles data-test="nav">
        <Link href="/items">
          <a>shop</a>
        </Link>
        {me && (
          <React.Fragment>
            <Link href="/sell">
              <a>sell</a>
            </Link>
            <Link href="/orders">
              <a>orders</a>
            </Link>
            <Link href="/me">
              <a>me</a>
            </Link>
            <Signout />
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {toggleCart => (
                <button onClick={toggleCart}>
                  My cart
                <CartCount count={me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)} />
                </button>
              )}
            </Mutation>
          </React.Fragment>
        )}

        {!me && (
          <Link href="/signup">
            <a>sign in</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
)

export default Nav
