/** Import node modules */
import { Router } from 'express'
/** Import App Modules */
import validate from '../middlewares/ajv.middleware.js'
import productSchema from '../validations/product.validation.js'
import sellerSchema from '../validations/seller.validation.js'
import sellerController from '../controllers/seller.controller.js'
import authenticationMiddleware from '../middlewares/authentication.middleware.js'
import helperUtils from '../utils/helper.util.js'
const router = Router()

router.get('/products/',
  authenticationMiddleware.authenticate,
  validate(productSchema.getProducts),
  helperUtils.queryBuilder(productSchema.getProducts, productSchema.defaultPopulateQuery),
  sellerController.getProducts)

router.get('/products/:id',
  authenticationMiddleware.authenticate,
  sellerController.getProduct)

router.post('/products/',
  authenticationMiddleware.authenticate,
  validate(sellerSchema.createProduct),
  sellerController.createProduct)

router.patch('/products/:id',
  authenticationMiddleware.authenticate,
  validate(sellerSchema.createProduct),
  sellerController.updateProduct)

router.delete('/products/:id',
  authenticationMiddleware.authenticate,
  sellerController.deleteProduct)

export default router
