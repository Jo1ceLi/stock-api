import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { getMongoRepository } from 'typeorm';
import ApiExcption from '../exceptions/ApiException';
import User from '../models/user';
import ModelValidation, { RequestType } from './ModelValidation.service';

export interface decode {
  id: string;
  email: string;
  userName: string;
  exp: number;
  iat: number;
}

class UserService {
    static async register(req: Request, next: NextFunction) {
        const { email, password, userName } = req.body;
        if (!(email && password && userName)) {
            return next(ApiExcption.badRequest('Email, password and userName are required.'));
        }
        const user = await User.findOne({ where: { email } });
        if (user) {
            return next(ApiExcption.badRequest('User already exist.'));
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            email,
            password: hashPassword,
            userName,
        }).save()
            .then((res) => res,
                (err) => {
                    next(new ApiExcption(400, err));
                });
        return true;
    }

    static async login(req: Request, next: NextFunction) {
        const expiredMins = 60;
        const { email, password } = req.body;
        const validationRes = ModelValidation.validateRequest(req, RequestType.Body, 'LoginInput', true, true);
        if (!validationRes.valid) {
            return next(ApiExcption.badRequest(validationRes.errors));
        }
        const user = await User.findOne({ where: { email } });
        if (!user) return next(new ApiExcption(401, 'User hasn\'t registered.'));
        if (await bcrypt.compare(password, user.password)) {
            const client = new SecretManagerServiceClient();
            const jwtSecretUrl = 'projects/743538361446/secrets/jwt-secret/versions/latest';
            const [version] = await client.accessSecretVersion({ name: jwtSecretUrl });
            const jwtSecret = version.payload?.data?.toString();
            if (jwtSecret) {
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        userName: user.userName,
                        exp: Math.floor(Date.now() / 1000) + (expiredMins * 60),
                    },
                    // secret.jwtsecret );
                    jwtSecret,
                );
                return token;
            }
            return next(new ApiExcption(401, 'JWT token error'));
        }
        return next(new ApiExcption(401, 'Wrong email or password'));
    }

    static async findUser(req: Request, res: Response, next: NextFunction): Promise<void | User> {
        const authentication = req.headers.authorization?.replace('Bearer ', '');
        if (!authentication) return next(new ApiExcption(401, 'Unauthorized'));
        const userId = req.params.id as string;
        const { id } = jwt.decode(authentication) as decode;
        if (userId !== id) return next(new ApiExcption(403, 'Forbidden'));
        const userRepo = getMongoRepository(User);
        const user = await userRepo.findOne(id);
        if (!user) return next(new ApiExcption(401, 'Can\'t find this user'));
        return user;
    }
}

export interface ValidationResult {
    valid: boolean,
    errorCount: number,
    errors?: [{
        name: string,
        message: string
    }]
}

export default UserService;
