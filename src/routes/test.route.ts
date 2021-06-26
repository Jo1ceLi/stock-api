import express from 'express';
import UserController from '../controllers/user.controller';
import { BaseRoute } from './route';

class TestRoute implements BaseRoute {
    path = '/';

    router = express.Router();

    controller = new UserController();

    static setRoutes() {
        //     res.status(200).json('Update user success');
        // })
    }
}
export default new TestRoute().router;
