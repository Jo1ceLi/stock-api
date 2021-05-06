import { NextFunction, Request, Response } from 'express';
import userService from '../services/user.service';

export class UserController {
    
    async register (req: Request, res: Response, next: NextFunction) {
        const user = await userService.register(req, next);
        if(user) res.status(200).json('register success');
    }
    async login (req: Request, res: Response, next: NextFunction) {
        const token = await userService.login(req, next);
        if(token) res.status(200).json({status: 200, message: `Enjoy your token.`,token});
    }
    async testAddAccount(req: Request, res: Response, next: NextFunction){
        const result = await userService.testAddAccount(req, res, next);
        res.status(200).json({status: 200, message: `Found`, account: result});
    }

    async findUserById(req: Request, res: Response, next: NextFunction){
        const result = await userService.findUser(req, res, next);
        if(result) res.status(200).json(result);
    }
}