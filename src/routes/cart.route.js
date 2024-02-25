/** Import node modules */
import { Router } from 'express'
/** Import App Modules */
import validate from '../middlewares/ajv.middleware.js'
import cartSchema from '../validations/cart.validation.js'
import cartController from '../controllers/cart.controller.js'
import authenticationMiddleware from '../middlewares/authentication.middleware.js'
const router = Router()

router.get('/:id',
  authenticationMiddleware.authenticate,
  cartController.getCart)

router.post('/',
  authenticationMiddleware.authenticate,
  validate(cartSchema.createCart),
  cartController.createCart)

router.patch('/:id',
  authenticationMiddleware.authenticate,
  validate(cartSchema.createCart),
  cartController.updateCart)


export default router
