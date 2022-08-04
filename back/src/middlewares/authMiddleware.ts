import express from 'express';
import constants from '../constants/constants';
import { ResponseObject } from '../types/request';

/**
 * Check if the user's cookie corresponds to a corresponding opened session, so if the request in authorized
 * @param req 
 * @param res 
 * @param next 
 */
function authMiddleware(req:express.Request, res:express.Response, next:express.NextFunction) : void {
    if ((req.params.id_person!==null 
            && req.params.id_person!==undefined 
            && parseInt(req.params.id_person)===req.session.id_person)
        ||
        (req.body.id_person!==null 
            && req.body.id_person!==undefined 
            && req.body.id_person===req.session.id_person)
        ||
        (req.body[0]!==undefined
            && req.body[0].id_person!==null 
            && req.body[0].id_person!==undefined 
            && req.body[0].id_person===req.session.id_person
        ))
    {
        next();
    }
    else{
        const responseObject:ResponseObject<null> = {response:null,err:'AUTHENTICATION'};
        res.status(constants.ERROR_CODE.AUTHENTICATION).json(responseObject).end();
    }
}

export default authMiddleware;