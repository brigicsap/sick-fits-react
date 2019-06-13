const { forwardTo } = require('prisma-binding')

const Query = {
  // each time a request comes in, it gives the signature of 4 vars
  // if this yoga query is the same as the prisma query,
  // we can just forward the prisma query here
  items: forwardTo('db'),

  //if there's no item, we could throw an error server side, that kicks in the <Error/> comp on the frontend
  item: forwardTo('db'),

  // async items(parent, args, ctx, info) {
  //   console.log('Getting Items!!');
  //   const items = await ctx.db.query.items();
  //   return items;
  // },
};

module.exports = Query
