import { Request, Response } from 'express'
import { UserInterface } from "../lib/User";
import User from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'ourSecret'
const jwtCookieExpires = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "1") 

const signToken = (id: string) => jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

const createSendToken = (user: any, statusCode: number, req: Request, res: Response) => {
  const token = signToken(user._id)

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + jwtCookieExpires * 24 * 60 * 60 * 1000 // time in milliseconds
    ),
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    httpOnly: true // protect from site scrypting attacks. It will receive, store and send, not allowing for any middle man
  })

  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

const checkPassword = async (passwordAttempt: string, userPassword: string) => {
  return await bcrypt.compareSync(passwordAttempt, userPassword)
}

const login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body

    if(!email || !password) return next(new AppError('Email and password required', 400))

    const user = await User.findOne({email}).select('+password')
    console.log('user', !!user)

    if(!user || !await(checkPassword(password, user.password))) return next(new AppError('Incorrect email/password', 401))

    createSendToken(user, 200, req, res)
})

export default {login}