import { AccountController } from './../controllers/account.controller';
import express, { Application, Router } from "express";
import AuthMiddleWare from '../middlewares/auth.middleware';
import { BaseRoute } from "./route";

class AccountRoute implements BaseRoute {
    path = '/';
    router = express.Router();
    controller = new AccountController();
    constructor() {
        this.setRoutes();
    }
    setRoutes() {
        this.router.get('/account/:id', AuthMiddleWare.checkJwt, this.controller.findAccountById);
    }
}
export default new AccountRoute().router;