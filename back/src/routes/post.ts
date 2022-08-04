import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
const router = express.Router({mergeParams: true});
import * as fs from 'fs';

import { Post } from '../types/post';
import { ResponseObject } from '../types/request';

import authMiddleware from '../middlewares/authMiddleware';

import postDAO from '../dao/postDAO';
import constants from '../constants/constants';

/**
 * Get a post by ID
 * @param id_post 
 * @returns Post with this ID
 */
router.get('/id/:id_post', (req:express.Request, res:express.Response) => {
    postDAO.getById(
        parseInt(req.params.id_post), 
        req.session.id_person
    ).then((response:ResponseObject<Post>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get posts from a person
 * @param id_person ID of the person who has posted the post
 * @param offset Offset in the returned list
 * @returns Posts of a person
 */
router.get('/person/:id_person/:offset', (req:express.Request, res:express.Response) => {
    postDAO.getByPerson(
        parseInt(req.params.id_person), 
        parseInt(req.params.offset), 
        req.session.id_person
    ).then((response:ResponseObject<Post[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get post randomly
 * @param offset Offset in the returned list
 * @returns Random posts
 */
router.get('/random/:offset', (req:express.Request, res:express.Response) => {
    postDAO.getRandomly(
        parseInt(req.params.offset), 
        req.session.id_person
    ).then((response:ResponseObject<Post[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get post by hashtag id
 * @param id_hashtag 
 * @returns Posts with this hashtag
 */
router.get('/hashtag/:id_hashtag', (req:express.Request, res:express.Response) => {
    postDAO.getByHashtag(
        parseInt(req.params.id_hashtag), 
        req.session.id_person
    ).then((response:ResponseObject<Post[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get most recent posts
 * @param offset Offset in the returned list
 * @returns Most recent posts
 */
router.get('/date/:offset', (req:express.Request, res:express.Response) => {
    postDAO.getByDate(
        parseInt(req.params.offset), 
        req.session.id_person
    ).then((response:ResponseObject<Post[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get most recent posts of a person subscriptions
 * @param id_person ID of the authenticated person
 * @param offset Offset in the returned list
 * @returns Most recent posts of followed accounts
 */
router.get('/subnews/:offset', authMiddleware, (req:express.Request, res:express.Response) => {
    postDAO.getByDateSubscriptionsOnly(
        parseInt(req.params.offset), 
        req.session.id_person
    ).then((response:ResponseObject<Post[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Create a post
 * @param post Post to create
 * @returns ID of the newly created post
 */
router.post('/', authMiddleware, (req:express.Request, res:express.Response) => {
    postDAO.createPost(
        req.body
    ).then((response:ResponseObject<number>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Update a post
 * @param postPost to update
 */
router.put('/', authMiddleware, (req:express.Request, res:express.Response) => {
    postDAO.updatePost(
        req.body
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.WITHOUT_CONTENT).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Delete a post
 * @param id_post ID of the post to delete
 */
router.delete('/', authMiddleware, (req:express.Request, res:express.Response) => {
    postDAO.deletePost(
        req.body.id_post
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Image
 */
// Params & path
const filterImage = (req:express.Request, file:any, cb:any) => {
    if (file.mimetype.split('/')[0] === 'image') {
        cb(null, true);
    } else {
        cb(new Error('Only images !'));
    }
};
const uploadImage = multer({
    storage:multer.memoryStorage(), 
    fileFilter: filterImage,
    limits:{fileSize: 10000000} // 10Mo max
});
// Download
router.get('/post_image/:id_post', (req:express.Request, res:express.Response) => {
    res.writeHead(constants.SUCCESS_CODE.OK, {'Content-type': 'image/png'});
    fs.access(`./uploads/posts/${req.params.id_post}.png`, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        }
        else{
            fs.readFile(`./uploads/posts/${req.params.id_post}.png`, (error, content) => {
                res.end(content);
            });
        }
    });
});
// Upload
router.post('/post_image/:id_person/:id_post', authMiddleware, uploadImage.single('image'), (req, res) => {
    sharp(req.file?.buffer)
        .resize(1200,1200, {fit:'inside'})
        .png()
        .toFile(`./uploads/posts/${req.params.id_post}.png`)
        .then(() => {
            res.status(constants.SUCCESS_CODE.OK).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

module.exports = router;