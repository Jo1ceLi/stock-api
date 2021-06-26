import express from 'express';
import { UserController } from '../controllers/index.controller';
import AuthMiddleWare from '../middlewares/auth.middleware';
import { BaseRoute } from './route';

class UserRoute implements BaseRoute {
    path = '/';

    router = express.Router();

    controller = UserController;

    constructor() {
        this.setRoutes();
    }

    setRoutes() {
        this.router.post('/register', this.controller.register);
        this.router.post('/login', this.controller.login);
        // this.router.post('/testAdd', AuthMiddleWare.checkJwt, this.controller.testAddAccount);
        this.router.get('/user/:id', AuthMiddleWare.checkJwt, this.controller.findUserById);
    }
}
export default new UserRoute().router;
