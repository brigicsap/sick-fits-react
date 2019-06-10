// every mutation has to mirror the schema in schema.graphql
const Mutations = {
  // parent => parent schema in graphql
  // args => args that have been passed to the query
  // ctx => surface the db + rest of the request
  // info => info about the graphql query
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    )

    return item
  },

  updateItem(parent, args, ctx, info) {
    //take a copy of the updates (we'll need the id later so we won't delete it in args)
    const updates = { ...args }
    //remove the id from the updates
    delete updates.id
    // ctx => context in the request
    // db => it's how we expose the prisma db
    // mutation => generated query or mutation in prisma.graphql
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      }
    },
      info //this is how the update item knows what to return
    )
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }
    // find the item
    const item = await ctx.db.query.item({ where }, `{id, title}`)
    //check if they own the item or have the permission
    // @TODO
    // delete it
    return ctx.db.mutation.deleteItem({ where }, info)
  }
}

module.exports = Mutations
