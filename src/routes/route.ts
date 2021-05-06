import { Router } from "express";

export interface BaseRoute {
    path: string;
    router: Router;
}