import { TDAccount } from './../models/td-account';
import  jwt  from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import ApiExcption from '../exceptions/ApiException';
import { Position } from '../models/position';
import { Instrument } from '../models/instrument';
import { ObjectID } from 'mongodb';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { getMongoRepository, getRepository } from 'typeorm';

class UserService {
    async register(req: Request, next: NextFunction) {
        const { email, password, userName } = req.body;
        if(!(email && password && userName)){
            return next(new ApiExcption(400, 'Email, password and userName are required.'));
        }
        const user = await User.findOne({where: { email }})
        if(user) {
            return next(new ApiExcption(400, 'User already exist.'));
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
            next(new ApiExcption(400, err));
        })
    }
    async login(req: Request, next: NextFunction) {
        const expiredMins = 60;
        const { email, password } = req.body;
        if(!(email && password)){
            return next(new ApiExcption(401, 'Email and password are required.'));
        }
        const user = await User.findOne({ where: { email }});
        if(!user) next(new ApiExcption(401, `User hasn't registered.`));
        else{
            if(await bcrypt.compare(password, user.password)){
                const client = new SecretManagerServiceClient();
                const jwtSecretUrl = 'projects/743538361446/secrets/jwt-secret/versions/latest';
                const [version] =  await client.accessSecretVersion({name: jwtSecretUrl});
                const jwtSecret = version.payload?.data?.toString();
                if(jwtSecret){
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email, 
                        userName: user.userName, 
                        exp: Math.floor(Date.now() / 1000) + (expiredMins * 60)
                    }, 
                    // secret.jwtsecret );
                    jwtSecret );
                    return token;
                }
                else{
                    return next(new ApiExcption(401, `JWT token error`));
                }
                
                
            }else{
                return next(new ApiExcption(401, `Wrong email or password`));
            }
        }
    }
    async testAddAccount(req: Request, res: Response, next: NextFunction) {

        const decode = jwt.decode(req.body.token) as decode;
        
        var instrument = new Instrument();
        instrument.assetType = "EQUITY";
        instrument.cusip = "46138G706";
        instrument.symbol = "TAN";
        var position = new Position();
        position.shortQuantity = 0;
        position.averagePrice = 104;
        position.currentDayProfitLoss = 0.5001;
        position.currentDayProfitLossPercentage = 0.06;
        position.longQuantity = 10.002;
        position.instrument = instrument;
        position.marketValue = 832.1664;
        position.maintenanceRequirement = 249.65;
        position.previousSessionLongQuantity = 10.002;
        console.log(position);
        var account = new TDAccount();
        // account.accountId = '635030026';
        account.positions = [position];

        // const manager = getManager();
        // await manager.save(account);
        const accountRespository = getRepository(TDAccount);
        accountRespository.save(account);
        
        // return await accountRespository.findOne({where: {accountId: decode.id}});

    }
    async findUser(req: Request, res: Response, next: NextFunction): Promise<void | User> {
        const authentication = req.headers.authorization?.replace('Bearer ', '');
        if(!authentication) return next(new ApiExcption(401, `Unauthorized`));
        const userId = req.params.id as string;
        const {id, email, userName, exp, iat} = jwt.decode(authentication) as decode;
        if(userId !== id) return next(new ApiExcption(403, `Forbidden`));
        const userRepo = getMongoRepository(User);
        const user = await userRepo.findOne(id);
        if(!user) return next(new ApiExcption(401, `Can't find this user`))
        return user;
    }
    
}

export interface decode {
    id: string;
    email: string;
    userName: string;
    exp: number;
    iat: number;
}

export default new UserService();