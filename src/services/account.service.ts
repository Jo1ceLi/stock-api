import { TDAccount } from './../models/td-account';
import { User } from './../models/user';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import ApiExcption from '../exceptions/ApiException';
import { decode } from './user.service';
class AccountService {
    async findAccount(req: Request, res: Response, next: NextFunction) {
        const authentication = req.headers.authorization?.replace('Bearer ', '');
        if(!authentication) return next(new ApiExcption(401, `Unauthorized`));
        const accountId = req.params.id as string;
        const {id, email, userName, exp, iat} = jwt.decode(authentication) as decode;
        const user = await User.findOne(id);
        if(!user) 
            return next(new ApiExcption(403, `Forbidden`));
        if(!user.tdAccountId.includes(accountId)) 
            return next(new ApiExcption(403, `Forbidden`));
        const account = await TDAccount.findOne({where: {accountId}});
        if(!accountId) return next(new ApiExcption(401, `Can't find this TD Account`));
        return account;
    }
}

export default new AccountService();