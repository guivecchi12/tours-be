"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/([""'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}, Please use another value!`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((error) => error.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new appError_1.default(message, 400);
};
const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const sendErrorProd = (err, req, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    else {
        console.error('Error 💥', err);
        res.status(500).json({ status: 'error', message: 'Something went very wrong' });
    }
};
const handleJWTInvalidToken = () => new appError_1.default('Invalid token. Please log in again!', 404);
const handleJWTExpiredToken = () => new appError_1.default('Your token has expired. Please log in again!', 404);
exports.default = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    let error = Object.assign(err);
    if (error.code === 11000)
        error = handleDuplicateFieldsDB(error);
    if (error.name === 'CastError')
        error = handleCastErrorDB(error);
    if (error.name === 'ValidationError')
        error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
        error = handleJWTInvalidToken();
    if (error.name === 'TokenExpiredError')
        error = handleJWTExpiredToken();
    process.env.NODE_ENV === 'development' ? sendErrorDev(error, req, res) : sendErrorProd(error, req, res);
};
