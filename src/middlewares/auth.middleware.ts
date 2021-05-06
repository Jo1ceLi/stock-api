import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiExcption from '../exceptions/ApiException';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'


class AuthMiddleWare {
    async checkJwt(req: Request, res: Response, next: NextFunction) {
        const client = new SecretManagerServiceClient();
        const jwtSecretUrl = 'projects/743538361446/secrets/jwt-secret/versions/latest';
        const [version] =  await client.accessSecretVersion({name: jwtSecretUrl});
        const jwtSecret = version.payload?.data?.toString();
        if(!jwtSecret) return next(new ApiExcption(403, `JWT Token error`));
        var token = req.headers.authorization?.replace('Bearer ', "");
        if(!token) token = req.body.token;
        if(token) {
            jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
                if(err)
                    next(new ApiExcption(403, err)); 
                    // res.json({success: false, error: err})
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

