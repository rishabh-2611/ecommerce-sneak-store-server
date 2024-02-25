/** Import node modules */
import { Router } from 'express'
/** Import App Modules */
import validate from '../middlewares/ajv.middleware.js'
import wishlistSchema from '../validations/wishlist.validation.js'
import wishlistController from '../controllers/wishlist.controller.js'
import authenticationMiddleware from '../middlewares/authentication.middleware.js'
const router = Router()

router.get('/:id',
  authenticationMiddleware.authenticate,
  wishlistController.getWishlist)

router.post('/',
  authenticationMiddleware.authenticate,
  validate(wishlistSchema.createWishlist),
  wishlistController.createWishlist)

router.patch('/:id',
  authenticationMiddleware.authenticate,
  validate(wishlistSchema.createWishlist),
  wishlistController.updateWishlist)


export default router
