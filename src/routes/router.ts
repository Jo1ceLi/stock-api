import { Router, Request, Response, NextFunction } from 'express';
import express from 'express';
import UserRouter from './user.route';
import TestRouter from './test.route';
import AccountRouter from './account.route';
import ApiExcption from '../exceptions/ApiException';


const routers: Array<Router> = [
    UserRouter,
    AccountRouter,
    TestRouter
]


export const route = express.Router();

routers.forEach(router => {
    route.use(router);
});

// route.get('*', function(err: ApiExcption, req: Request, res: Response, next: NextFunction) {
//     const status = err.status || 404;
//     const message = err.message || 'Not Found';
//     res.status(status)
//        .send({
//            status,
//            message
//        });
// })