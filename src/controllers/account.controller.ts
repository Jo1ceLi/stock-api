import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../services/index.service'

export class AccountController {
    async findAccountById(req: Request, res: Response, next: NextFunction){
        const result = await AccountService.findAccount(req, res, next);
        if(result) res.status(200).json(result);
        // const result = await .findUser(req, res, next);
        // if(result) res.status(200).json(result);
    }
}