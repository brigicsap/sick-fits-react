import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $image: String
    $largeImage: String
    $price: Int!
  ) {
    createItem(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) {
      id
    }
  }
`

class CreateItem extends Component {

  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  }
  // we need an instance method here because that binds 'this' to the CreateItem instance.
  //es6 classes don't bind regular methods to the instance so we would need that constructor() { super() { this.blah = this.blah.bind(this)}} thing
  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value

    this.setState({ [name]: val })
  }

  uploadFile = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    // cloudinary preset
    data.append('upload_preset', 'sickfits')
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/ddn6mcrhz/image/upload',
      {
        method: 'POST',
        body: data
      }
    )

    const file = await res.json()
    console.log({ file })

    // @TODO handle error, incorrect file size etc
    // disable form while processing
    if (file.error) {
      return
    }

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  }
  // Mutation takes a fn as a child, that has args {mutationfunction, payload}
  // these can be desctructured to the actual mutation handler name
  // and the payload items we need
  render() {
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={async e => {
            // Stop the form from submitting
            e.preventDefault()
            // call the mutation
            const res = await createItem()
            // change them to the single item page
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id }
            })
          }}>
            <Error error={error} />
            <fieldset
              disabled={loading}
              aria-busy={loading}>
              <label htmlFor="title">
                Image
                <input
                  type="file"
                  id="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.uploadFile} />
                {this.state.image &&
                  <img
                    width="200"
                    src={this.state.image}
                    alt="Upload preview"
                  />
                }
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
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
                  value={this.state.price}
                  onChange={this.handleChange} />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a description"
                  required
                  value={this.state.description}
                  onChange={this.handleChange} />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )
        }
      </Mutation>
    )
  }
}

export default CreateItem
export { CREATE_ITEM_MUTATION }
