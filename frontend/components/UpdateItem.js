import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: {id: $id}) {
      id
      title
      description
      price
    }
  }
`

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`

class UpdateItem extends Component {

  state = {}
  // we need an instance method here because that binds 'this' to the updateItem instance.
  //es6 classes don't bind regular methods to the instance so we would need that constructor() { super() { this.blah = this.blah.bind(this)}} thing
  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value

    this.setState({ [name]: val })
  }
  updateItem = async (e, updateItemMutation) => {
    e.preventDefault()
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    })
  }

  // Query sits on top because first we want to get the item data, fill the form with it and then change it
  // Mutation is within the query because if query is successful, we update the item

  //Mutation takes a fn as a child, that has args {mutationfunction, payload}
  // these can be desctructured to the actual mutation handler name
  // and the payload items we need
  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) {
            return <p>Loading...</p>
          }
          if (!data.item) {
            return <p>No item found for id {this.props.id}</p>
          }

          return (
            <Mutation
              mutation={UPDATE_ITEM_MUTATION}
              variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => { this.updateItem(e, updateItem) }}>
                  <Error error={error} />
                  <fieldset
                    disabled={loading}
                    aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this.handleChange} />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this.handleChange} />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter a description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.handleChange} />
                    </label>
                    <button type="submit">Sav{loading ? 'ing' : 'e'} changes</button>
                  </fieldset>
                </Form>
              )
              }
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
