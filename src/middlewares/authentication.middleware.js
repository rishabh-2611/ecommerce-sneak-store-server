/** Import node modules */
import jwt from 'jsonwebtoken'
import config from 'config'


/** Passport Authentication Function */
function authenticate (req, res, next) {
  req._passport.instance.authenticate('jwt', function (err, user) {
    if (err) {
      return rejectError(req, res)
    }
    if (!user) {
      return rejectInvalidUser(req, res)
    }

    if (user) {
      acceptRequest(req, user, next)
    }
  })(req, res, next)
}

/** Passport Login Function */
async function login (req) {
  return new Promise((resolve, reject) => {
    req._passport.instance.authenticate('local', { session: false }, function (err, info, user) {
      if (err) {
        reject(err)
      } else if (info) {
        reject(info)
      } else {
        const maxAge = '24h'
        const userInfo = {
          _id: user._id,
          email: user.email
        }

        const userDetails = {
          _id: user._id,
          email: user.email,
          name: `${user.details.firstName} ${user.details.lastName}`,
          role: user.role,
          // wishlist: user.wishlist
          // cart: user.cart
        }
        const token = jwt.sign(userInfo, config.jwt_secret, { expiresIn: maxAge })
        resolve({ token, userDetails })
      }
    })(req)
  })
}

function rejectError (req, res) {
  req.returnTo = req.originalUrl
  if (req.originalUrl.includes('/api/v1')) {
    res.status(401).send('Authentication required')
  } else {
    res.status(404).send('Please enter a valid url')
  }
}

function rejectInvalidUser (req, res) {
  // req.session.returnTo = req.originalUrl;
  if (req.originalUrl.includes('/api/v1')) {
    res.status(401).send('Authentication failed! Please verify your api key, or the endpoint you are trying to access.')
  } else {
    res.status(404).send('Please enter a valid url')
  }
}

function acceptRequest (req, user, next) {
  req.user = {
    _id: user._id,
    isEnabled: user.isEnabled,
    email: user.email,
    name: `${user.details.firstName} ${user.details.lastName}`,
    role: user.role
  }

  // console.log(req)
  next()
}


export default { authenticate, login }
