import { Request } from 'express';
import Validator from 'swagger-model-validator';
import { ValidationResult } from './user.service'; 
import swaggerDoc from '../../openapi.json';

class ModelValidation {
    constructor() {
        // var validator = new Validator();
    }
    validator = new Validator();
    validateRequest(req: Request, reqType: RequestType, modelName: string, allowBlankTarget = false, disabllowExtraProperties = false): ValidationResult {
    var res: ValidationResult;
    if(reqType === RequestType.Body) {
            res = this.validator.validate(req.body, swaggerDoc.components.requestBodies[modelName].content['application/json'].schema, null, allowBlankTarget, disabllowExtraProperties);
        }
        else {
            res = this.validator.validate(req.body, swaggerDoc.components.parameters[modelName].content['application/json'].schema, null, allowBlankTarget, disabllowExtraProperties);
        }
        return res;
    }
}
export default new ModelValidation();


export enum RequestType {
    Body,
    Params
}

