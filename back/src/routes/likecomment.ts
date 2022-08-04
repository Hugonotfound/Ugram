import express from 'express';
const router = express.Router({mergeParams: true});

import { PersonName } from '../types/person';
import { ResponseObject } from '../types/request';

import authMiddleware from '../middlewares/authMiddleware';

import likecommentDAO from '../dao/likecommentDAO';
import constants from '../constants/constants';

/**
 * Get the number of likes on a comment
 * @param id_comment 
 * @returns Number of likes on the comment
 */
router.get('/count/:id_comment', (req:express.Request, res:express.Response) => {
    likecommentDAO.count(
        parseInt(req.params.id_comment)
    ).then((response:ResponseObject<number>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get the names of the persons that have liked
 * @param id_comment 
 * @returns ID, lastname and forname of every person who liked the comment
 */
router.get('/related/:id_comment', (req:express.Request, res:express.Response) => {
    likecommentDAO.getAllPersonsRelated(
        parseInt(req.params.id_comment)
    ).then((response:ResponseObject<PersonName[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Create a like on a comment
 * @param id_person ID of the person who liked the comment
 * @param id_comment ID of the comment to like
 */
router.post('/', authMiddleware, (req:express.Request, res:express.Response) => {
    likecommentDAO.createLikecomment(
        req.body.id_person, 
        req.body.id_comment
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.CREATED).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Delete a like on a comment
 * @param id_person ID of the person who liked the comment
 * @param id_comment ID of the liked comment
 */
router.delete('/', authMiddleware, (req:express.Request, res:express.Response) => {
    likecommentDAO.deleteLikecomment(
        req.body.id_person, 
        req.body.id_comment
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.WITHOUT_CONTENT).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

module.exports = router;