/** Import node modules */
import { Router } from 'express'
/** Import App Modules */
import validate from '../middlewares/ajv.middleware.js'
import mediaSchema from '../validations/media.validation.js'
import mediaController from '../controllers/media.controller.js'
import authenticationMiddleware from '../middlewares/authentication.middleware.js'
const router = Router()
import multer from 'multer'
const upload = multer({ dest: 'public/assets/uploads/' })

router.get('/',
  authenticationMiddleware.authenticate,
  mediaController.getMedias)

router.get('/:id',
  authenticationMiddleware.authenticate,
  mediaController.getMedia)

router.post('/',
  authenticationMiddleware.authenticate,
  upload.array('files[]'),
  mediaController.uploadFiles)

router.patch('/:id',
  authenticationMiddleware.authenticate,
  validate(mediaSchema.createMedia),
  mediaController.updateMedia)

router.delete('/:id',
  authenticationMiddleware.authenticate,
  mediaController.deleteMedia)


export default router
