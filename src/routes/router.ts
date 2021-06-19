import { UserRouter, AccountRouter }  from './route';
import { Router } from 'express';
import express from 'express';
import TestRouter from './test.route';


const routers: Router[] = [
    UserRouter,
    AccountRouter,
    TestRouter
]


export const route = express.Router();

routers.forEach(router => {
    route.use(router);
});