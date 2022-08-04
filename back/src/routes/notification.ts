import express from 'express';
const router = express.Router({mergeParams: true});

import { ResponseObject } from '../types/request';

import authMiddleware from '../middlewares/authMiddleware';

import constants from '../constants/constants';
import notificationDAO from '../dao/notificationDAO';
import { Notification } from '../types/notification';

/**
 * Get the number of notifications of a person
 * @param id_person 
 * @returns 
 */
router.get('/count/:id_person', authMiddleware, (req:express.Request, res:express.Response) => {
    notificationDAO.countByPersonReceiving(
        req.session.id_person
    ).then((response:ResponseObject<number|null>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get notifications of a person
 * @param id_person 
 * @returns 
 */
router.get('/id/:id_person', authMiddleware, (req:express.Request, res:express.Response) => {
    notificationDAO.getByPersonReceiving(
        req.session.id_person
    ).then((response:ResponseObject<Notification[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Read the notification
 * @param id_notification 
 * @returns 
 */
router.put('/', authMiddleware, (req:express.Request, res:express.Response) => {
    notificationDAO.readNotification(
        req.body.id_notification
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

module.exports = router;