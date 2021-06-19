import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/index.service'

export class UserController {
    
    async register (req: Request, res: Response, next: NextFunction) {
        const user = await UserService.register(req, next);
        if(user) res.status(200).json('register success');
    }
    async login (req: Request, res: Response, next: NextFunction) {
        const token = await UserService.login(req, next);
        if(token) res.status(200).json({status: 200, message: `Enjoy your token.`,token});
    }
    // async testAddAccount(req: Request, res: Response, next: NextFunction){
    //     const result = await UserService.testAddAccount(req, res, next);
    //     res.status(200).json({status: 200, message: `Found`, account: result});
    // }

    async findUserById(req: Request, res: Response, next: NextFunction){
        const result = await UserService.findUser(req, res, next);
        if(result) res.status(200).json(result);
    }
}