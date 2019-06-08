// This connects to the remote Prisma db and gives us access to query it with JS
// no import in node.js so we use require
const { Prisma } = require('prisma-binding')

const db = new Prisma({
  // it's the generated prisma.graphQl file that has all the types+fields
  typeDefs: 'src/generated/prisma.graphql',
  // give prisma access to the db
  endpoint: process.env.PRISMA_ENDPOINT,
  // token for the db on prod
  secret: process.env.PRISMA_SECRET,
  debug: true
})

module.exports = db
