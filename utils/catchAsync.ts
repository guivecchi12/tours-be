import { Request, Response, NextFunction, RequestHandler } from 'express'
import MulterRequest from '../lib/MulterRequest'

export default function (
  fn: (
    req: Request | MulterRequest,
    res: Response,
    next: NextFunction
  ) => Promise<any>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => next(err));
}}

