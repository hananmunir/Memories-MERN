import express from 'express'
const router = express.Router()
import { signin, signup } from '../controller/user.js'

router.put('/signup', signup)
router.put('/signin', signin)

export default router