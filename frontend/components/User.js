import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

const CURRENT_USER_QUERY = gql`
query SINGLE_ITEM_QUERY {
  me {
    id
    name
    email
    permissions
  }
}
`
// render prop component!!
// user component child component just takes the query payload and passes it further down for other children
// so every time a user component is used, it just has the query automatically
// any other prop on the user can just be spread for additional user components
const User = props => (
  <Query
    {...props}
    query={CURRENT_USER_QUERY}>
    {payload => props.children(payload)}
  </Query>
)

User.PropTypes = {
  children: PropTypes.func.isRequired
}

export default User
export { CURRENT_USER_QUERY }
