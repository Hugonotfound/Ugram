import express from 'express';
const router = express.Router({mergeParams: true});

import { PersonName } from '../types/person';
import { ResponseObject } from '../types/request';

import authMiddleware from '../middlewares/authMiddleware';

import likepostDAO from '../dao/likepostDAO';
import constants from '../constants/constants';

/**
 * Get the number of likes on a post
 * @param id_post 
 * @returns Number of likes on the post
 */
router.get('/count/:id_post', (req:express.Request, res:express.Response) => {
    likepostDAO.count(
        parseInt(req.params.id_post)
    ).then((response:ResponseObject<number>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get the names of the persons that have liked
 * @param id_post 
 * @returns ID, lastname and forname of every person who liked the post
 */
router.get('/related/:id_post', (req:express.Request, res:express.Response) => {
    likepostDAO.getAllPersonsRelated(
        parseInt(req.params.id_post)
    ).then((response:ResponseObject<PersonName[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Create a like on a post
 * @param id_person ID of the person who liked the post
 * @param id_post ID of the post to like
 */
router.post('/', authMiddleware, (req:express.Request, res:express.Response) => {
    likepostDAO.createLikepost(
        req.body.id_person, 
        req.body.id_post
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.CREATED).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Delete a like on a post
 * @param id_person ID of the person who liked the post
 * @param id_post ID of the liked post
 */
router.delete('/', authMiddleware, (req:express.Request, res:express.Response) => {
    likepostDAO.deleteLikepost(
        req.body.id_person, 
        req.body.id_post
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.WITHOUT_CONTENT).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

module.exports = router;