import { Router } from "express";

import UserRouter from './user.route';
import AccountRouter from './account.route';

export {UserRouter, AccountRouter}

export interface BaseRoute {
    path: string;
    router: Router;
}