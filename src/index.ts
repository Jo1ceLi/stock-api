import { UserController } from './controllers/user.controller';
import express, { Router } from 'express';
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from '../swaggerDoc.json';
import cors from 'cors';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import {router} from './routes/router';

dotenv.config();

const k = new UserController()
const app = express();
app.use(cors());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {explorer: true}))
app.get('/api/test', (req, res)=>{
    res.send('hello');
})
app.post('/api/register', k.register )

const main = async () => {
    await createConnection({
        type: 'mongodb',
        url: process.env.mongodb,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        synchronize: true,
        logging: true,
        entities: [__dirname + '/models/*.ts']
    }).then(() => console.log('Connected to DB!!'));
}
main();
app.listen(3000, ()=>console.log('server is listening http://localhost:3000'))