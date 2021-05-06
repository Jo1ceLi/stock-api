import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../openapi.json';
import express from "express";
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { createConnection } from "typeorm";
import { route } from './routes/router';
import ErrorMiddleWare from './middlewares/error.middleware';
import { Request, Response, NextFunction } from 'express';
import ApiExcption from './exceptions/ApiException';

class APP {
    app = express();
    client = new SecretManagerServiceClient();
    constructor() {
        this.config();
        this.db();
        this.routerSetUp();
        this.errorHandler();
    }

    async config() {
        this.app.use(express.json());
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
        const dbUrlSecret = 'projects/743538361446/secrets/mongoDB-connectionString/versions/latest';
        const [version] = await this.client.accessSecretVersion({name: dbUrlSecret});
        const url = version.payload?.data?.toString();

        if (url) {
            await createConnection({
                type: 'mongodb',
                // url: secret.mongodb,
                url,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                synchronize: true,
                logging: true,
                entities: [ __dirname + '/models/*.*']
            }).then( () => console.log('Connected to DB'), 
                     (err) => console.log(err) )
        }
    }
    
}
export async function accessSecretVersion(name: string, client: SecretManagerServiceClient): Promise<string> {
    const [version] = await client.accessSecretVersion({name});

    if(version.payload?.data){
        const payload = version.payload.data?.toString();
        return payload;
    }
    
    else{
        console.log('Fetching secret error');
        throw Error('Fetching secret error');
    }
}

export default new APP().app;