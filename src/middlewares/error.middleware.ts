import { Response, Request } from 'express';

import ApiExcption from '../exceptions/ApiException';

function ErrorMiddleWare(error: ApiExcption, req: Request, res: Response) {
    if (error) {
        const status = error.status || 500;
        const message = error.message || 'Error';
        res.status(status).send({
            status,
            message,
        });
        return;
    }
    res.status(500).send('Internal error happened....');
}
export default ErrorMiddleWare;
