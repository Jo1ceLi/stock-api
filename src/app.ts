import { secret } from './../secret';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../openapi.json';
import express from "express";
import cors from 'cors';
import { createConnection } from "typeorm";
import { route } from './routes/router';
import ErrorMiddleWare from './middlewares/error.middleware';
import { Request, Response, NextFunction } from 'express';
import ApiExcption from './exceptions/ApiException';

class APP {
    app = express();
    constructor() {
        this.config();
        this.db();
        this.routerSetUp();
        this.errorHandler();
    }

    config() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use('/swagger', swaggerUi.serve, 
                     swaggerUi.setup(swaggerDoc, {explorer: true}))
    }

    routerSetUp() {
        this.app.use(route);
    }

    errorHandler() {
        this.app.use(ErrorMiddleWare);
    }

    async db() {
        await createConnection({
            type: 'mongodb',
            url: secret.mongodb,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            synchronize: true,
            logging: true,
            entities: [__dirname + '/models/*.ts']
        }).then(() => console.log('Connected to DB!!'));
    }

}
export default new APP().app;