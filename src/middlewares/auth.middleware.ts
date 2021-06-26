import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import ApiExcption from '../exceptions/ApiException';

class AuthMiddleWare {
    static async checkJwt(req: Request, res: Response, next: NextFunction) {
        const client = new SecretManagerServiceClient();
        const jwtSecretUrl = 'projects/743538361446/secrets/jwt-secret/versions/latest';
        const [version] = await client.accessSecretVersion({ name: jwtSecretUrl });
        const jwtSecret = version.payload?.data?.toString();
        if (!jwtSecret) return next(new ApiExcption(403, 'JWT Token error'));
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            jwt.verify(token, jwtSecret, (err: any) => {
                if (err) return next(new ApiExcption(403, err));
                // res.json({success: false, error: err})

                res.status(200);
                return next();
            });
        } else {
            res.status(403).send({
                success: false,
                message: 'No token provided',
            });
            return false;
        }
        return false;
    }

    // giveJwt() {

    // }
}
export default AuthMiddleWare;
