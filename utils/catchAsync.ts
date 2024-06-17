import { Request, Response, NextFunction, RequestHandler } from 'express'
import MulterRequest from '../lib/MulterRequest'
import mongoose from 'mongoose'

type myError = Error & {errors: {
  message: string
}}

export default function (
  fn: (
    req: Request | MulterRequest,
    res: Response,
    next: NextFunction
  ) => Promise<any>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => {
      // Check if the error is a Mongoose validation error
      if (err instanceof mongoose.Error.ValidationError) {
        // Format the validation error before sending it to the client
        const formattedErrors = Object.values(err.errors).map((error: any) => error.message);

        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: formattedErrors
        });
      } else {
        // If it's not a Mongoose validation error, pass it to the next middleware
        next(err);
      }
    });
}}

