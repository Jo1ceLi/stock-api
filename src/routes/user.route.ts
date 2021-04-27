import { UserController } from './../controllers/user.controller';
import { Application, Router } from "express";
import { UserService } from "../services/user.service";
import Route from "./route";

class UserRoute extends Route {
    userController = new UserController();
    constructor() { 
        super(); 
    }
    setRoutes() {
        this.router.post('/api', this.userController.register);
    }
}
export default new UserRoute();
