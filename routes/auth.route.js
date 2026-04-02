import express from 'express'
import { loginUser, registerUser, googleAuth } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/google-auth', googleAuth)

export default router