/** Import node modules */
import { Router } from 'express'
/** Import App Modules */
import validate from '../middlewares/ajv.middleware.js'
import reviewSchema from '../validations/review.validation.js'
import reviewController from '../controllers/review.controller.js'
import authenticationMiddleware from '../middlewares/authentication.middleware.js'
const router = Router()

router.get('/',
  authenticationMiddleware.authenticate,
  reviewController.getReviews)

router.get('/:id',
  authenticationMiddleware.authenticate,
  reviewController.getReview)

router.post('/',
  authenticationMiddleware.authenticate,
  validate(reviewSchema.createReview),
  reviewController.createReview)

router.patch('/:id',
  authenticationMiddleware.authenticate,
  validate(reviewSchema.createReview),
  reviewController.updateReview)

router.delete('/:id',
  authenticationMiddleware.authenticate,
  reviewController.deleteReview)


export default router
