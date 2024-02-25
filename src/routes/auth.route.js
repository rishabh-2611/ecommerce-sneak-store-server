/** Import node modules */
import { Router } from 'express'
/** Import App Modules */
import authController from '../controllers/auth.controller.js'
import validate from '../middlewares/ajv.middleware.js'
import authSchema from '../validations/auth.validation.js'

const router = Router()

/* POST Login */
router.post('/login', authController.login)

/* POST Sign Up */
router.post('/register', validate(authSchema.register), authController.register)

export default router
