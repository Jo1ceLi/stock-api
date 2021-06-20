import { Response } from 'express';
import { Request, NextFunction } from 'express';
import ApiExcption from "../exceptions/ApiException";


function ErrorMiddleWare(error: ApiExcption, req: Request, res: Response, next: NextFunction){
    if(error) {
        const status = error.status || 500;
        const message = error.message || 'Error';
        res.status(status).send({
            status,
            message
        });
        return;
    }
    res.status(500).send(`Internal error happened....`);
}
export default ErrorMiddleWare;
