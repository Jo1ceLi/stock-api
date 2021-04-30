import { UserController } from './../controllers/user.controller';
import express, { Application, Router } from "express";
import { BaseRoute } from "./route";
import AuthMiddleWare from '../middlewares/auth.middleware';
import TestService from '../services/test.service';

class TestRoute implements BaseRoute {
    path = '/';
    router = express.Router();
    controller = new UserController();

    constructor() {
        this.setRoutes();
    }
    setRoutes() {
        this.router.post('/test', AuthMiddleWare.checkJwt, TestService.test)
    }
}
export default new TestRoute().router;