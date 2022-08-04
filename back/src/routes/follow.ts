import express from 'express';
const router = express.Router({mergeParams: true});

import { PersonName } from '../types/person';
import { ResponseObject } from '../types/request';

import authMiddleware from '../middlewares/authMiddleware';

import followDAO from '../dao/followDAO';
import constants from '../constants/constants';

/**
 * Check if a person is subscribed to another
 * @param id_person 
 * @param id_person_tocheck 
 * @returns boolean
 */
router.get('/subscriptions/check/:id_person/:id_person_tocheck', (req:express.Request, res:express.Response) => {
    followDAO.isSubscribedTo(parseInt(req.params.id_person),parseInt(req.params.id_person_tocheck))
        .then((response:ResponseObject<boolean>) => {
            res.status(constants.SUCCESS_CODE.OK).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

/**
 * Get a person subscriptions number
 * @param id_person 
 * @returns Number of subscriptions
 */
router.get('/subscriptions/count/:id_person', (req:express.Request, res:express.Response) => {
    followDAO.countSubscriptions(parseInt(req.params.id_person))
        .then((response:ResponseObject<number>) => {
            res.status(constants.SUCCESS_CODE.OK).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

/**
 * Get a person followers number
 * @param id_person 
 * @returns Number of followers
 */
router.get('/followers/count/:id_person', (req:express.Request, res:express.Response) => {
    followDAO.countFollowers(parseInt(req.params.id_person))
        .then((response:ResponseObject<number>) => {
            res.status(constants.SUCCESS_CODE.OK).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

/**
 * Get a person subscriptions names
 * @param id_person 
 * @returns ID, lastname and forname of the subscriptions
 */
router.get('/subscriptions/name/:id_person', (req:express.Request, res:express.Response) => {
    followDAO.getSubscriptions(parseInt(req.params.id_person))
        .then((response:ResponseObject<PersonName[]>) => {
            res.status(constants.SUCCESS_CODE.OK).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

/**
 * Get a person followers names
 * @param id_person 
 * @returns ID, lastname and forname of the followers
 */
router.get('/followers/name/:id_person', (req:express.Request, res:express.Response) => {
    followDAO.getFollowers(parseInt(req.params.id_person))
        .then((response:ResponseObject<PersonName[]>) => {
            res.status(constants.SUCCESS_CODE.OK).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

/**
 * Create a subscription from a person to a followed person
 * @param id_person Person wanting to subscribe
 * @param id_person_followed Person that will be followed
 */
router.post('/subscriptions', authMiddleware, (req:express.Request, res:express.Response) => {
    followDAO.createSubscription(req.body.id_person, req.body.id_person_followed)
        .then((response:ResponseObject<null>) => {
            res.status(constants.SUCCESS_CODE.CREATED).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

/**
 * Delete a subscription from a person to a followed person
 * @param id_person Person wanting to unsubscribe
 * @param id_person_followed Person that will be unfollowed
 */
router.delete('/subscriptions', authMiddleware, (req:express.Request, res:express.Response) => {
    followDAO.deleteSubscription(req.body.id_person, req.body.id_person_followed)
        .then((response:ResponseObject<null>) => {
            res.status(constants.SUCCESS_CODE.OK).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

/**
 * Delete a follower
 * @param id_person Person wanting to delete a follower
 * @param id_person_following Follower
 */
router.delete('/followers', authMiddleware, (req:express.Request, res:express.Response) => {
    followDAO.deleteFollower(req.body.id_person, req.body.id_person_following)
        .then((response:ResponseObject<null>) => {
            res.status(constants.SUCCESS_CODE.OK).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

module.exports = router;
