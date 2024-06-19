import { Request, Response, NextFunction } from "express"
import AppError from "../utils/appError"

const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err: any) => {
    const value = err.errmsg.match(/([""'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value: ${value}, Please use another value!`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (err: any) => {
    const errors = Object.values(err.errors).map((error: any) => error.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}

const sendErrorDev = (err: any, req: Request, res: Response) => {

        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
}

const sendErrorProd = (err: any, req: Request, res: Response) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else{
        console.error('Error 💥', err)
        res.status(500).json({status: 'error', message: 'Something went very wrong'})
    }
}

const handleJWTInvalidToken = () => new AppError('Invalid token. Please log in again!', 404)
const handleJWTExpiredToken = () => new AppError('Your token has expired. Please log in again!', 404)

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("error type ====", typeof err)
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, req, res)
    } else if(process.env.NODE_ENV === 'production'){
        let error = Object.assign(err)

        if(error.code === 11000) error = handleDuplicateFieldsDB(error)
        if(error.name === 'CastError') error = handleCastErrorDB(error)
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error)
        if(error.name === 'JsonWebTokenError') error = handleJWTInvalidToken()
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredToken()

        sendErrorProd(error, req, res)
    }

}