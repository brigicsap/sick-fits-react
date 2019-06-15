import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION(
    $email: String!,
    $password: String!
  ) {
    signin(
      email: $email,
      password: $password
    ) {
      id
      email
    }
  }
`

class SignIn extends Component {
  state = {
    email: '',
    password: ''
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  // Mutation takes {mutationfunction, payload} as children, these can be desctructured
  // refetchQuery => when a user is signed in, the page doesn't actually reload so we need to update the ui by refetching the user so that we know they're logged in
  // when the mutation finished, it refetches the query and gets the now signed-in user's details from the db
  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY }
        ]}>
        {(signin, { error, loading }) => (
          <Form
            method="POST"
            onSubmit={async e => {
              e.preventDefault()
              await signin()
              //@TODO handle errors, dplicate email etc
              this.setState({
                email: '',
                password: ''
              })
            }}>
            <fieldset
              disabled={loading}
              aria-busy={loading}>
              <h2>Sign in to your account</h2>
              <Error error={error} />
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
              <button type="submit">Sign in</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SignIn;
