import { IController } from './../controllers/IController';
import { Router } from "express";

export interface BaseRoute {
    path: string;
    router: Router;
    controller: IController;
}