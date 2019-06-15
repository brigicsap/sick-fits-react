import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Title from './styles/Title'
import ItemStyles from './styles/ItemStyles'
import PriceTag from './styles/PriceTag'
import formatMoney from '../lib/formatMoney'
import DeleteItem from '../components/DeleteItem'
import AddToCart from '../components/AddToCart'

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  }

  render() {
    const { item } = this.props
    return (
      <ItemStyles>
        {item.image && <img src={item.image} alt={item.title} />}
        <Title>
          <Link href={{
            pathname: '/item',
            query: { id: item.id }
          }}>
            <a>{item.title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(item.price)}</PriceTag>
        <p>{item.description}</p>
        <div className="buttonList">
          <Link href={{
            pathname: 'update',
            query: { id: item.id }
          }}>
            <a>Edit ✎</a>
          </Link>
          <AddToCart id={item.id} />
          <DeleteItem id={item.id}>Delete this item</DeleteItem>
        </div>
      </ItemStyles>
    )
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired
  // or we can shape them even more:
  // item: PropTypes.shape({
  //   title: PropTypes.string.isRequired,
  //   price: PropTypes.number.isRequired,
  // })
}

export default Item
