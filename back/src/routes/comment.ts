import express from 'express';
const router = express.Router({mergeParams: true});

import { Comment } from '../types/comment';
import { ResponseObject } from '../types/request';

import authMiddleware from '../middlewares/authMiddleware';

import commentDAO from '../dao/commentDAO';
import constants from '../constants/constants';

/**
 * Get a comment by ID
 * @param id_comment
 * @returns The identified comment
 */
router.get('/id/:id_comment', (req:express.Request, res:express.Response) => {
    commentDAO.getById(
        parseInt(req.params.id_comment)
    ).then((response:ResponseObject<Comment>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get number of comments on a post
 * @param id_post 
 * @returns Number of comments on the post
 */
router.get('/post/count/:id_post', (req:express.Request, res:express.Response) => {
    commentDAO.countByPost(
        parseInt(req.params.id_post)
    ).then((response:ResponseObject<number>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get comments from a post
 * @param id_person ID of the person who has posted the comments
 * @param offset Offset in the returned list
 * @returns Comments from the person
 */
router.get('/post/get/:id_post', (req:express.Request, res:express.Response) => {
    commentDAO.getByPost(
        parseInt(req.params.id_post), 
        req.session.id_person
    ).then((response:ResponseObject<Comment[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Create a comment
 * @param comment Comment to create
 * @returns ID of the newly created comment
 */
router.post('/', authMiddleware, (req:express.Request, res:express.Response) => {
    commentDAO.createComment(
        req.body.id_post,
        req.body.id_person,
        req.body.text_comment
    ).then((response:ResponseObject<number|null>) => {
        res.status(constants.SUCCESS_CODE.CREATED).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Update a comment
 * @param comment Comment to update
 */
router.put('/', authMiddleware, (req:express.Request, res:express.Response) => {
    commentDAO.updateComment(
        req.body
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.WITHOUT_CONTENT).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Delete a comment
 * @param id_comment ID of the comment to delete
 */
router.delete('/', authMiddleware, (req:express.Request, res:express.Response) => {
    commentDAO.deleteComment(
        req.body.id_comment
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

module.exports = router;