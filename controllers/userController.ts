import { Request, Response } from 'express'

import User from '../models/userModel'
import { getOne} from '../utils/handleQuery'


const getUser = getOne(User)

const createUser = (req: Request, res: Response) => {
    res.status(500).json({
        status: 'error',
        message: 'Use signup route instead'
    })
}

export default {getUser, createUser}