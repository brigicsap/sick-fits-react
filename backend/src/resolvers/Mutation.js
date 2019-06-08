// every mutation has to mirror the schema in schema.graphql
const Mutations = {
  // parent => parent schema in graphql
  // args => args that have been passed to the query
  // context => surface the db + rest of the request
  // info => info about the graphql query
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info
    );

    console.log(item)

    return item
  }
};

module.exports = Mutations
