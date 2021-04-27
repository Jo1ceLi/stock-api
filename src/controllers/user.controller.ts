import { UserService } from './../services/user.service';
import { NextFunction, Request, Response } from 'express';

export class UserController {
    userService = new UserService();
    async register (req: Request, res: Response, next: NextFunction) {
        const user = await this.userService.register(req.body);
        res.status(200).json(user);
        next();
    }
    async login (req: Request, res: Response, next: NextFunction) {
        
    }
}