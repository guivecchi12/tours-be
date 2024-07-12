import express from "express"
import userController from "../controllers/userController"
import authController from "../controllers/authController"

const router = express.Router()

router.route('/')
.get(userController.getUser)
.post(userController.createUser)

router.post('/login', authController.login)

export default router