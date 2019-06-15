const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' })
const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

// Use express middleware to handle cookies (JWT)
// middleware -> fn that runs between the request and the response
// cookieParser allows us to access cookies in a formatted object
server.express.use(cookieParser())
// @TODO use express middleware to populate current user

//decode JWT to get user id on every request
server.express.use((req, res, next) => {
  const { token } = req.cookies
  //check if user is signed in
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    //put user id onto request for further requests to access
    req.userId = userId
  }
  next()
})

//create middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  // if they are ot logged in, skip
  if (!req.userId) {
    return next()
  }
  // this has been populated in the previous middleware
  const user = await db.query.user(
    { where: { id: req.userId } }, //which user
    '{ id, permissions, name, email }' //graphql fields for that user
  )

  req.user = user

  next()
})

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`)
  }
)
