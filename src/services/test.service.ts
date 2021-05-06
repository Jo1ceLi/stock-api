import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { User } from '../models/user';
import { Any, getRepository, In } from 'typeorm';
import { decode } from './user.service';
import { TDAccount } from '../models/td-account';

class TestService {
    async test(req: Request, res: Response) {
        const decoded = jwt.decode(req.body.token) as decode;
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(decoded.id);
        console.log(user?.tdAccountId);
        const accounts = getRepository(TDAccount);
        const tdAccount = await accounts.find({where:{ accountId: {$in: user!.tdAccountId }}});

        res.status(200).json(tdAccount);
    }
}
export default new TestService();