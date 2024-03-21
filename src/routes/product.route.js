/** Import node modules */
import { Router } from 'express'
/** Import App Modules */
import validate from '../middlewares/ajv.middleware.js'
import productSchema from '../validations/product.validation.js'
import productController from '../controllers/product.controller.js'
import helperUtils from '../utils/helper.util.js'
const router = Router()

router.get('/',
  // validate(productSchema.getProducts),
  helperUtils.queryBuilder(productSchema.getProducts, productSchema.defaultPopulateQuery),
  productController.getProducts)

router.get('/:id',
  // authenticationMiddleware.authenticate,
  productController.getProduct)

// router.post('/',
//   authenticationMiddleware.authenticate,
//   validate(productSchema.createProduct),
//   productController.createProduct)

// router.patch('/:id',
//   authenticationMiddleware.authenticate,
//   validate(productSchema.createProduct),
//   productController.updateProduct)

// router.delete('/:id',
//   authenticationMiddleware.authenticate,
//   productController.deleteProduct)


export default router
