const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')

const Query = {
  // each time a request comes in, it gives the signature of 4 vars
  // if this yoga query is the same as the prisma query,
  // we can just forward the prisma query here
  items: forwardTo('db'),

  //if there's no item, we could throw an error server side, that kicks in the <Error/> comp on the frontend
  item: forwardTo('db'),

  itemsConnection: forwardTo('db'),

  me(parent, args, ctx, info) {
    //check if there is a current user id
    if (!ctx.request.userId) {
      // important not to throw an error and just return nothing
      // because someone might not be logged in
      return null
    }

    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    )
  },

  async users(parent, args, ctx, info) {
    // chek if user is logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in')
    }
    // check if user has permissions to query users
    await hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    // if they do query all users
    return ctx.db.query.users({}, info)
  },

  async order(parent, args, ctx, info) {
    // make sure user is logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in')
    }
    // query current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id }
      },
      info
    )
    // check if they have the permissions to see the order
    const ownsOrder = order.user.id === ctx.request.userId
    const hasPermissonToSeeOrder = ctx.request.user.permissions.includes('ADMIN')
    if (!ownsOrder || !hasPermissonToSeeOrder) {
      throw new Error('You cannot see this')
    }
    // return order
    return order
  },

  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request
    if (!userId) {
      throw new Error('You must be logged in')
    }

    return ctx.db.query.orders(
      {
        where: {
          user: { id: userId },
        },
      },
      info
    )
  }
};

module.exports = Query
