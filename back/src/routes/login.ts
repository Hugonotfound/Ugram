import express from 'express';
const router = express.Router({mergeParams: true});

import authMiddleware from '../middlewares/authMiddleware';

import { ResponseObject } from '../types/request';
import { PersonName } from '../types/person';

import loginDAO from '../dao/loginDAO';

import * as dotenv from 'dotenv';
dotenv.config();
import constants from '../constants/constants';

/**
 * Login : check if the mail and password are correct, and create a session/cookie for this person
 * @param body - mail_person, password_person
 * @returns Public data of the connected person
 */
router.post('/in', (req:express.Request, res:express.Response) => {
    loginDAO.login(req.body)
        .then((response:ResponseObject<PersonName|null>) => {
            // Set session data
            if (response.err==='NO' && response.response!==null) req.session.id_person = response.response.id_person;
            // Response
            res.status(constants.SUCCESS_CODE.OK).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

/**
 * Logout : delete session/cookie for this person
 * @param body - id_person
 */
router.post('/out', authMiddleware, (req:express.Request, res:express.Response) => {
    req.session.destroy(err => {
        if (err) return res.status(constants.ERROR_CODE.SERVER).end();
        else {
            res.clearCookie((process.env.SESSION_NAME) ? process.env.SESSION_NAME : 'session_id');
            const responseObject:ResponseObject<null> = {response:null,err:'NO'};
            res.status(constants.SUCCESS_CODE.OK).json(responseObject).end();
        }
    });
});

module.exports = router;