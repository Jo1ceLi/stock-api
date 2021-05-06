import { UserController } from './../controllers/user.controller';
import express, { Application, Router } from "express";
import { BaseRoute } from "./route";
import AuthMiddleWare from '../middlewares/auth.middleware';
import TestService from '../services/test.service';
import UserService from '../services/user.service';
import { Response, Request } from 'express';
class TestRoute implements BaseRoute {
    path = '/';
    router = express.Router();
    controller = new UserController();

    constructor() {
        this.setRoutes();
    }
    setRoutes() {
        this.router.post('/test', AuthMiddleWare.checkJwt, UserService.updateUserAccount, (req: Request, res: Response) => {
            res.status(200).json('Update user success');
        })
        
    }
}
export default new TestRoute().router;