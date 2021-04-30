import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../../secret';


class AuthMiddleWare {
    checkJwt(req: Request, res: Response, next: NextFunction) {
        const token = req.body.token;
        if(token) {
            jwt.verify(token, secret.jwtsecret, (err: any, decoded: any) => {
                if(err) 
                    res.json({success: false, error: err})
                else{
                    res.status(200);
                    next()
                }
            })
        }else{
            res.status(403).send({
                success: false,
                message: 'No token provided'
            })
        }
    }
    giveJwt(){

    }
}
export default new AuthMiddleWare()

