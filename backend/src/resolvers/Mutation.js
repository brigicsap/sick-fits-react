require('dotenv').config({ path: '.env' })
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// node built-in module to create tokens
const { randomBytes } = require('crypto')
// turns callback-based functions into promise based async functions
const { promisify } = require('util')

//helper to set cookie
const setCookie = (ctx, token) => {
  return ctx.response.cookie('token', token, {
    httpOnly: true, // cannot be accessed by javascript
    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
  })
}
// every resolver mutation has to mirror the schema in schema.graphql
const Mutations = {
  // parent => parent schema in graphql
  // args => args that have been passed to the query
  // ctx => surface the db + rest of the request
  // info => info about the graphql query
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that')
    }

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // create relationship between item and user
          user: {
            connect: { id: ctx.request.userId }
          },
          ...args,
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
    return ctx.db.mutation.updateItem(
      {
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
    // check if they own the item or have the permission
    // @TODO above
    // delete item
    return ctx.db.mutation.deleteItem({ where }, info)
  },

  async signup(parent, args, ctx, info) {
    //format emails to prevent nonsense casing
    args.email = args.email.toLowerCase()
    // hash pwd -> store an encoded version of the pwd string
    // when user logs in next time, we hash the pwd again and check if the stored hash matches
    // 10 => SALT = salting a hash means different hashes are generated for the same pwds so in different applications different hashes of the same pwds are stored
    const password = await bcrypt.hash(args.password, 10)
    //create user in db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password, // override initial pwd with the hashed one
          permissions: {
            set: ['USER']
          }
        }
      }, info
    )
    //create JWT token for user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    //set jwt as cookie on response so that it goes along with every request automatically
    setCookie(ctx, token)
    //return user to the browser
    return user
  },

  async signin(parent, { email, password }, ctx, info) {
    // check if there is a user with the entered email
    const user = await ctx.db.query.user({ where: { email } })

    if (!user) {
      throw new Error(`No user found with this email ${email}`)
    }

    // check if the password is correct
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }
    // generate jwt token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // set cookie with the token
    setCookie(ctx, token)
    // return user
    return user
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token')

    return { message: 'You are signed out' }
  },

  async requestReset(parent, args, ctx, info) {
    // check if user is real
    const user = await ctx.db.query.user({ where: { email: args.email } })
    // set reet token and expiry on user
    if (!user) {
      throw new Error(`No user found with this email ${args.email}`)
    }
    const randomBytesPromisified = promisify(randomBytes)
    const resetToken = (await randomBytesPromisified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 //1hr
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    })
    // email user the reset token

    return { message: 'Thanks' }
  },

  async resetPassword(parent, args, ctx, info) {
    // check if the pwds match
    if (args.password !== args.confirmPassword) {
      throw new Error('The passwords don\'t match')
    }
    // chek if reset token is valid
    // check if it's expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    })

    if (!user) {
      throw new Error('This token is invalid or expired')
    }
    // hash new pwd
    const password = await bcrypt.hash(args.password, 10)
    // save new pwd to user ad remove old reset token fields
    const updatedUser = await ctx.db.mutation.updateUser({
      // where: { resetToken: args.resetToken },
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    // generate jwt
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
    // set jwt cookie
    setCookie(ctx, token)
    // return new user
    return updatedUser
  }
}

module.exports = Mutations
