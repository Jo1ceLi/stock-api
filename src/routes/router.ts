import express, { Router } from 'express';

import { UserRouter, AccountRouter } from './route';
import TestRouter from './test.route';

const routers: Router[] = [
    UserRouter,
    AccountRouter,
    TestRouter,
];

const route = express.Router();

routers.forEach((router) => {
    route.use(router);
});
export default route;
