import { Router } from 'express';
import express from 'express';
import UserRouter from './user.route';
import TestRouter from './test.route';


const routers: Array<Router> = [
    UserRouter,
    TestRouter
]


export const route = express.Router();

routers.forEach(router => {
    route.use(router);
});