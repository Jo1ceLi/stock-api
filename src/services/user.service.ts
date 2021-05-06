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
                const jwtSecret =  (await client.accessSecretVersion({name: jwtSecretUrl})).toString();
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
    async findUser(req: Request, res: Response, next: NextFunction) {
        const authentication = req.headers.authorization?.replace('Bearer ', '');
        if(!authentication) return next(new ApiExcption(401, `Unauthorized`));
        const userId = req.params.id as string;
        const {id, email, userName, exp, iat} = jwt.decode(authentication) as decode;
        if(userId !== id) return next(new ApiExcption(403, `Forbidden`));
        const userRepo = getMongoRepository(User);
        const user = await userRepo.findOne(id);
        if(!user) return next(new ApiExcption(401, `Can't find this user`))
        const userWithTD = await userRepo.aggregate([
            {
                $match:
                {
                    email: 'ms0615122@gmail.com'
                }
            },
            {
                $lookup:
                {
                    from: 'td_account',
                    localField: 'tdAccountId',
                    foreignField: 'accountId',
                    as: 'tdAccountInfo'
                }
            }
            ]).toArray()
        return userWithTD;
    }
    async updateUserAccount(req: Request, res: Response, next: NextFunction) {
        const updatePositions = [
            {
                "shortQuantity": 0,
                "averagePrice": 104.001,
                "currentDayProfitLoss": -3.20064,
                "currentDayProfitLossPercentage": -0.38,
                "longQuantity": 10.002,
                "settledLongQuantity": 10.002,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "46138G706",
                    "symbol": "TAN"
                },
                "marketValue": 828.46566,
                "maintenanceRequirement": 248.54,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 10.002
            },
            {
                "shortQuantity": 0,
                "averagePrice": 112.23,
                "currentDayProfitLoss": 56.5646166,
                "currentDayProfitLossPercentage": 1.59,
                "longQuantity": 27.067,
                "settledLongQuantity": 27.067,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "037833100",
                    "symbol": "AAPL"
                },
                "marketValue": 3614.7924366,
                "maintenanceRequirement": 1084.44,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 27.067
            },
            {
                "shortQuantity": 0,
                "averagePrice": 30.277,
                "currentDayProfitLoss": 140,
                "currentDayProfitLossPercentage": 4.86,
                "longQuantity": 1,
                "settledLongQuantity": 1,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "OPTION",
                    "cusip": "0AAPL.FG30120000",
                    "symbol": "AAPL_061623C120",
                    "description": "AAPL Jun 16 2023 120.0 Call",
                    "putCall": "CALL",
                    "underlyingSymbol": "AAPL"
                },
                "marketValue": 3020,
                "maintenanceRequirement": 0,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 1
            },
            {
                "shortQuantity": 0,
                "averagePrice": 156.216,
                "currentDayProfitLoss": -3.76846,
                "currentDayProfitLossPercentage": -0.63,
                "longQuantity": 4.009,
                "settledLongQuantity": 4.009,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "00214Q401",
                    "symbol": "ARKW"
                },
                "marketValue": 591.84867,
                "maintenanceRequirement": 177.55,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 4.009
            },
            {
                "shortQuantity": 0,
                "averagePrice": 107.805,
                "currentDayProfitLoss": -18.27375,
                "currentDayProfitLossPercentage": -1.37,
                "longQuantity": 11.075,
                "settledLongQuantity": 11.075,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "00214Q104",
                    "symbol": "ARKK"
                },
                "marketValue": 1319.254,
                "maintenanceRequirement": 395.78,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 11.075
            },
            {
                "shortQuantity": 0,
                "averagePrice": 53.478,
                "currentDayProfitLoss": 1.495,
                "currentDayProfitLossPercentage": 0.12,
                "longQuantity": 23,
                "settledLongQuantity": 23,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "00214Q708",
                    "symbol": "ARKF"
                },
                "marketValue": 1203.245,
                "maintenanceRequirement": 360.97,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 23
            },
            {
                "shortQuantity": 0,
                "averagePrice": 505.876,
                "currentDayProfitLoss": -222.6,
                "currentDayProfitLossPercentage": -2.24,
                "longQuantity": 14,
                "settledLongQuantity": 14,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "88160R101",
                    "symbol": "TSLA"
                },
                "marketValue": 9709.56,
                "maintenanceRequirement": 3883.82,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 14
            },
            {
                "shortQuantity": 0,
                "averagePrice": 98.364,
                "currentDayProfitLoss": -9.033,
                "currentDayProfitLossPercentage": -1.69,
                "longQuantity": 6.022,
                "settledLongQuantity": 6.022,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "00214Q302",
                    "symbol": "ARKG"
                },
                "marketValue": 526.14214,
                "maintenanceRequirement": 210.46,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 6.022
            },
            {
                "shortQuantity": 0,
                "averagePrice": 132,
                "currentDayProfitLoss": -2.555,
                "currentDayProfitLossPercentage": -2.52,
                "longQuantity": 1,
                "settledLongQuantity": 1,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "91332U101",
                    "symbol": "U"
                },
                "marketValue": 99.025,
                "maintenanceRequirement": 29.71,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 1
            },
            {
                "shortQuantity": 0,
                "averagePrice": 213.5,
                "currentDayProfitLoss": 1.9054,
                "currentDayProfitLossPercentage": 0.39,
                "longQuantity": 2,
                "settledLongQuantity": 2,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "852234103",
                    "symbol": "SQ"
                },
                "marketValue": 491.5454,
                "maintenanceRequirement": 147.46,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 2
            },
            {
                "shortQuantity": 0,
                "averagePrice": 25.294,
                "currentDayProfitLoss": -65.25,
                "currentDayProfitLossPercentage": -1.95,
                "longQuantity": 145,
                "settledLongQuantity": 145,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "69608A108",
                    "symbol": "PLTR"
                },
                "marketValue": 3275.55,
                "maintenanceRequirement": 1310.22,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 145
            },
            {
                "shortQuantity": 0,
                "averagePrice": 251.133,
                "currentDayProfitLoss": 15.555,
                "currentDayProfitLossPercentage": 2.25,
                "longQuantity": 3,
                "settledLongQuantity": 3,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "01609W102",
                    "symbol": "BABA"
                },
                "marketValue": 708.405,
                "maintenanceRequirement": 212.52,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 3
            },
            {
                "shortQuantity": 0,
                "averagePrice": 490,
                "currentDayProfitLoss": 1.5272,
                "currentDayProfitLossPercentage": 0.3,
                "longQuantity": 1,
                "settledLongQuantity": 1,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "64110L106",
                    "symbol": "NFLX"
                },
                "marketValue": 514.9972,
                "maintenanceRequirement": 154.5,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 1
            },
            {
                "shortQuantity": 0,
                "averagePrice": 1458,
                "currentDayProfitLoss": -3.09,
                "currentDayProfitLossPercentage": -0.13,
                "longQuantity": 1,
                "settledLongQuantity": 1,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "02079K107",
                    "symbol": "GOOG"
                },
                "marketValue": 2407.03,
                "maintenanceRequirement": 722.11,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 1
            },
            {
                "shortQuantity": 0,
                "averagePrice": 519.86,
                "currentDayProfitLoss": 0.385,
                "currentDayProfitLossPercentage": 0.06,
                "longQuantity": 1,
                "settledLongQuantity": 1,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "67066G104",
                    "symbol": "NVDA"
                },
                "marketValue": 600.765,
                "maintenanceRequirement": 180.23,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 1
            },
            {
                "shortQuantity": 0,
                "averagePrice": 227,
                "currentDayProfitLoss": -16.59,
                "currentDayProfitLossPercentage": -3.21,
                "longQuantity": 3,
                "settledLongQuantity": 3,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "87918A105",
                    "symbol": "TDOC"
                },
                "marketValue": 500.46,
                "maintenanceRequirement": 150.14,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 3
            },
            {
                "shortQuantity": 0,
                "averagePrice": 38.011,
                "currentDayProfitLoss": 44.5,
                "currentDayProfitLossPercentage": 1.9,
                "longQuantity": 50,
                "settledLongQuantity": 50,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "389637109",
                    "symbol": "GBTC"
                },
                "marketValue": 2387,
                "maintenanceRequirement": 0,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 50
            },
            {
                "shortQuantity": 0,
                "averagePrice": 383,
                "currentDayProfitLoss": -2.21,
                "currentDayProfitLossPercentage": -0.35,
                "longQuantity": 2,
                "settledLongQuantity": 2,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "98980L101",
                    "symbol": "ZM"
                },
                "marketValue": 636.93,
                "maintenanceRequirement": 318.47,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 2
            },
            {
                "shortQuantity": 0,
                "averagePrice": 40.5,
                "currentDayProfitLoss": 11.485,
                "currentDayProfitLossPercentage": 2.88,
                "longQuantity": 10,
                "settledLongQuantity": 10,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "62914V106",
                    "symbol": "NIO"
                },
                "marketValue": 409.885,
                "maintenanceRequirement": 204.94,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 10
            },
            {
                "shortQuantity": 0,
                "averagePrice": 14.057,
                "currentDayProfitLoss": 92.5,
                "currentDayProfitLossPercentage": 5.77,
                "longQuantity": 1,
                "settledLongQuantity": 1,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "OPTION",
                    "cusip": "0NIO..AK30035000",
                    "symbol": "NIO_012023C35",
                    "description": "NIO Jan 20 2023 35.0 Call",
                    "putCall": "CALL",
                    "underlyingSymbol": "NIO"
                },
                "marketValue": 1695,
                "maintenanceRequirement": 0,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 1
            },
            {
                "shortQuantity": 0,
                "averagePrice": 333,
                "currentDayProfitLoss": 32.3,
                "currentDayProfitLossPercentage": 1.17,
                "longQuantity": 4,
                "settledLongQuantity": 4,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "74967X103",
                    "symbol": "RH"
                },
                "marketValue": 2784.38,
                "maintenanceRequirement": 835.31,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 4
            },
            {
                "shortQuantity": 0,
                "averagePrice": 3233,
                "currentDayProfitLoss": -11.875,
                "currentDayProfitLossPercentage": -0.34,
                "longQuantity": 1,
                "settledLongQuantity": 1,
                "settledShortQuantity": 0,
                "instrument": {
                    "assetType": "EQUITY",
                    "cusip": "023135106",
                    "symbol": "AMZN"
                },
                "marketValue": 3455.545,
                "maintenanceRequirement": 1036.66,
                "currentDayCost": 0,
                "previousSessionLongQuantity": 1
            }
        ] as Position[]
        const account = await TDAccount.findOne(`608e78a6db4cf6250981ca44`);
        const accountRepo = getMongoRepository(TDAccount)
        const updated = await accountRepo.update(
        { id: new ObjectID('608e78a6db4cf6250981ca44')},
        { positions: updatePositions}
        );
        next();
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