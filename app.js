/* eslint-disable no-unused-vars */
/** Import node modules */
import 'dotenv/config'
import express from 'express'
import { Server } from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import qs from 'qs'

/** Import App Modules */

/** Import MongoDB init script */
import mongoInit from './src/services/init/mongodb-init.js'

/** Import Passport Middleware */
import initPassport from './src/middlewares/passport.middleware.js'

/** Import REST APIs */
import registerRoutes from './src/routes/index.js'

/** Import Mongoose Connection */
import mongooseConnection from './src/services/init/mongoose.service.js'


/** Initialize Express App */
const app = express()
const httpServer = Server(app)

let port = 3001

const { json, urlencoded } = bodyParser

/** Initialize DBs */
mongooseConnection.initDB()

/** Body Parser */
app.set('query parser', function (str) {
  return qs.parse(str, { depth: 20 })
})
app.use(json())
app.use(
  urlencoded({
    extended: true
  })
)

/** Cookie Parser */
app.use(cookieParser())

/** Enable CORS */
const enableCORS = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_APP)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, refresh_token, access_token, Access-Control-Allow-Origin')
  res.header('Access-Control-Allow-Credentials', true)
  next()
}
app.use(enableCORS)

/** Intialize passport */
app.use(passport.initialize())
initPassport.initializePassportJWT()
initPassport.initializePassportLocal()

/** Register REST APIs */
registerRoutes(app)

/** Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  // console.error(err.message, err.stack, err)
  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).send({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  } else if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).send({
      status: err.status,
      message: err.message
    })
  }
})

/** Init mongo db script */
mongoInit.initMongoDB().then(console.log).catch(console.error)

/** Start Server */
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`SneakStore server listening at http://localhost:${port}`)
})

export { app }
