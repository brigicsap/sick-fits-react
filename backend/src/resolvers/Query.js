const { forwardTo } = require('prisma-binding')

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
  }
};

module.exports = Query
