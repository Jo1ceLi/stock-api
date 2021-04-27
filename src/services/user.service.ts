import { Request } from 'express';
import { User } from '../models/user';

export class UserService {
    async register(req: Request) {
        const { email, password, userName } = req.body;
        const user = await User.findOne({where: { email }})
        if(user) {
            throw new Error('User already exist');
        }
        return await User.create({
            email, password, userName
        }).save()
        .then(res => {
            return res;
        },
        err => {
            throw new Error(err);
        })
    }
}