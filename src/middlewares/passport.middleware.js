/** Import node modules */
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import config from 'config'

/** Import App Modules */
import userRepo from '../repositories/user.repo.js'
import passwordUtil from '../utils/password.util.js'
import generalUtil from '../utils/general.util.js'

const initializePassportJWT = () => {
  passport.use(new JWTStrategy({
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.jwt_secret
  }, async (jwtPayload, next) => {
    try {
      console.log(jwtPayload)

      const userDetails = await userRepo.getUser({ _id: jwtPayload._id })  
      if (!userDetails) return next(null, false)
      return next(null, userDetails)
    } catch (error) {
      return next(error, null)
    }
  }
  ))
}

const initializePassportLocal = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (username, password, next) => {
    try {
      const userDetails = await userRepo.getUser({ email: username })
      if (!userDetails) {
        return next(null, 'Please provide a valid email and password!', null)
      }
      if (!userDetails.isEnabled) {
        return next(null, 'User Account is not active!', null)
      }

      const isValidPassword = await passwordUtil.validatePassword(password, userDetails.credentials.password)
      if (!isValidPassword) {
        return next(null, 'Please provide a valid email and password!', null)
      } else {
        return next(null, null, userDetails)
      }
    } catch (error) {
      return next(error, 'Something went wrong!', null)
    }
  }
  ))
}

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies.authToken
  }
  // console.log(token)
  return token
}

export default { initializePassportJWT, initializePassportLocal }
