import { Request } from 'express';
import Validator from 'swagger-model-validator';
import { ValidationResult } from './user.service';
import swaggerDoc from '../../openapi.json';

export enum RequestType {
    Body,
    Params
}

class ModelValidation {
    static validateRequest(req: Request, reqType: RequestType, modelName: string,
        allowBlankTarget = false, disabllowExtraProperties = false): ValidationResult {
        let res: ValidationResult;
        const validator = new Validator();
        if (reqType === RequestType.Body) {
            res = validator.validate(req.body, swaggerDoc.components.requestBodies[modelName].content['application/json'].schema, null, allowBlankTarget, disabllowExtraProperties);
        } else {
            res = validator.validate(req.body, swaggerDoc.components.parameters[modelName].content['application/json'].schema, null, allowBlankTarget, disabllowExtraProperties);
        }
        return res;
    }
}
export default ModelValidation;
