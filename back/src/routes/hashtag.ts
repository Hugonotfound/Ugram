import express from 'express';
const router = express.Router({mergeParams: true});

import { Hashtag } from '../types/hashtag';

import { ResponseObject } from '../types/request';

import hashtagDAO from '../dao/hashtagDAO';
import constants from '../constants/constants';

/**
 * Get more oftenly used hashtags
 * @returns More oftenly used hashtags with the number of occurrences
 */
router.get('/mostused', (req:express.Request, res:express.Response) => {
    hashtagDAO.moreOftenlyUsedHashtags()
        .then((response:ResponseObject<Hashtag[]>) => {
            res.status(constants.SUCCESS_CODE.OK).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

/**
 * Search hashtag
 * @param search_text
 * @returns Hashtags corresponding to the search
 */
router.get('/search/:search_text', (req:express.Request, res:express.Response) => {
    hashtagDAO.searchHashtags(req.params.search_text)
        .then((response:ResponseObject<Hashtag[]>) => {
            res.status(constants.SUCCESS_CODE.OK).json(response).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

module.exports = router;