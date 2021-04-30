import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

class TestService {
    async test(req: Request, res: Response) {
        const decoded = jwt.decode(req.body.token);
        console.log(decoded);
        res.status(200).json('testing service has passed');
    }
}
export default new TestService();