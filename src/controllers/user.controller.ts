import { NextFunction, Request, Response } from 'express';
import userService from '../services/user.service';

export class UserController {
    
    async register (req: Request, res: Response, next: NextFunction) {
        // const user = await this.userService.register(req.body);
        const user = await userService.register(req);
        if(user){
            res.status(200).json('register success');
        }else{
            res.status(400).json('register fail')
        }
        next();
    }
    async login (req: Request, res: Response, next: NextFunction) {
        const token = await userService.login(req);
        if(token) res.status(200).json(token);
        else res.status(400).send(`Login fail`);
    }
}