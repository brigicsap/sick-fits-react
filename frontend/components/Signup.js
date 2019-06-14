import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!,
    $email: String!,
    $password: String!
  ) {
    signup(
      name: $name,
      email: $email,
      password: $password
    ) {
      id
      name
      email
    }
  }
`

class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: ''
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  // Mutation takes {mutationfunction, payload} as children, these can be desctructured
  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}>
        {(signup, { error, loading }) => (
          <Form
            method="POST"
            onSubmit={async e => {
              e.preventDefault()
              await signup()
              //@TODO handle errors, dplicate email etc
              this.setState({
                name: '',
                email: '',
                password: ''
              })
            }}>
            <fieldset
              disabled={loading}
              aria-busy={loading}>
              <h2>Sign up for an account</h2>
              <Error error={error} />
              <label htmlFor="name">
                Name
              <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={this.saveToState} />
              </label>
              <label htmlFor="email">
                Email
              <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.saveToState} />
              </label>
              <label htmlFor="password">
                Password
              <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState} />
              </label>
              <button type="submit">Sign up</button>
            </fieldset>
          </Form>
        )
        }
      </Mutation>
    );
  }
}

export default Signup;
