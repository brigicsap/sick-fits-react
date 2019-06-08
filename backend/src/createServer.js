// Import the graphQl Yoga server
const { GraphQLServer } = require('graphql-yoga')

// import resolvers
// query resolvers => pull data
// mutation resolvers => update/push/delete data
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const db = require('./db')

// Spin up new GraphQl Yoga server that's gonna interface qith graphQl
function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    // need to be able to access the db from the resolvers and this will enable us to do that
    context: req => ({ ...req, db })
  })
}

module.exports = createServer
