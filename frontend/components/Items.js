import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Item from '../components/Item'
import Pagination from '../components/Pagination'
import { perPage } from '../config'

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY(
    $skip: Int = 0,
    $first: Int = ${perPage}) {
    items(
      first: $first,
      skip: $skip
    ) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`

const Center = styled.div`
  text-align: center;
`

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 6rem;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`

// Query component can only take a function as the child!
// payload => destructure needed items in payload directly in fn args
// Query fetchPolicy="network-only"-> never caches
class Items extends Component {
  render() {
    return (
      <Center>
        <Pagination page={this.props.page} />
        <Query
          query={ALL_ITEMS_QUERY}
          variables={{
            skip: this.props.page * perPage - perPage
          }}>
          {({ data, error, loading }) => {
            if (loading) {
              return <p>Loading...</p>
            }
            if (error) {
              return <p>Error: {error.message}</p>
            }
            return <ItemsList>
              {data.items.map(item => <Item key={item.id} item={item} />)}
            </ItemsList>
          }
          }
        </Query>
        <Pagination page={this.props.page} />
      </Center >
    )
  }
}

export default Items
export { ALL_ITEMS_QUERY }
