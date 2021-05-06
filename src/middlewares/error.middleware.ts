import { Response } from 'express';
import { Request, NextFunction } from 'express';
import ApiExcption from "../exceptions/ApiException";


function ErrorMiddleWare(error: ApiExcption, req: Request, res: Response, next: NextFunction){
    const status = error.status || 500;
    const message = error.message || 'Error';
    res.status(status)
       .send({
           status,
           message
       });
}
export default ErrorMiddleWare;
