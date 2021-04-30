import { UserController } from './../controllers/user.controller';
import express, { Application, Router } from "express";
import { BaseRoute } from "./route";

class UserRoute implements BaseRoute {
    path = '/';
    router = express.Router();
    controller = new UserController();
    constructor() {
        this.setRoutes();
    }
    setRoutes() {
        this.router.post('/register', this.controller.register);
        this.router.post('/login', this.controller.login);
    }
}
export default new UserRoute().router;