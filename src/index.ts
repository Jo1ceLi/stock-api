import express from 'express';
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from '../swaggerDoc.json';
import cors from 'cors';

console.log('helloworld');

const app = express();
app.use(cors());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {explorer: true}))
app.get('/api/test', (req, res)=>{
    res.send('hello');
})
app.listen(3000, ()=>console.log('server is listening http://localhost:3000'))