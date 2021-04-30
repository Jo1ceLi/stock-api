import  jwt  from 'jsonwebtoken';
import { Request } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { secret } from '../../secret';

class UserService {
    async register(req: Request) {
        console.log(req.body);
        const { email, password, userName } = req.body;
        if(!(email && password && userName)){
            console.log('no required input')
            return;
        }
        const user = await User.findOne({where: { email }})
        if(user) {
            throw new Error('User already exist');
        }
        const hashPassword = await bcrypt.hash(password, 10);
        return await User.create({
            email, 
            password: hashPassword, 
            userName
        }).save()
        .then(res => {
            return res;
        },
        err => {
            throw new Error(err);
        })
    }
    async login(req: Request) {
        const expiredMins = 1;
        const { email, password } = req.body;
        if(!(email && password)){
            throw new Error('Email and password are required');
        }
        const user = await User.findOne({ where: { email }});
        if(!user) throw new Error (`User hasn't registered`);
        else{
            if(await bcrypt.compare(password, user.password)){
                const token = jwt.sign({
                    id: user.id,
                    email: user.email, 
                    userName: user.userName, 
                    exp: Math.floor(Date.now() / 1000) + (expiredMins * 60),
                }, secret.jwtsecret );
                return token;
            }else{
                return new Error(`Wrong email or password`)
            }
        }
    }

}
export default new UserService();