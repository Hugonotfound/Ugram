import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
const router = express.Router({mergeParams: true});
import * as fs from 'fs';

import { Person, PersonName, PersonWithFollow } from '../types/person';
import { ResponseObject } from '../types/request';

import authMiddleware from '../middlewares/authMiddleware';

import personDAO from '../dao/personDAO';
import constants from '../constants/constants';
import path from 'path';

/**
 * Get a person by ID
 * @param id_person 
 * @returns Person with this ID
 */
router.get('/id/:id_person', (req:express.Request, res:express.Response) => {
    personDAO.getById(
        parseInt(req.params.id_person)
    ).then((response:ResponseObject<PersonWithFollow>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Get every person, ordered by lastname
 * @param offset Offset in the returned list 
 * @returns Array of person
 */
router.get('/all/:offset', (req:express.Request, res:express.Response) => {
    personDAO.getAll(
        parseInt(req.params.offset)
    ).then((response:ResponseObject<Person[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Search a person by name (lastname or forename)
 * @param search_text String of the search bar
 * @param offset Offset in the returned list
 * @returns Array of persons corresponding to the search
 */
router.get('/search/:search_text/:offset', (req:express.Request, res:express.Response) => {
    personDAO.searchByName(
        req.params.search_text, 
        parseInt(req.params.offset)
    ).then((response:ResponseObject<PersonName[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});


/**
 * Recommand users with most followers
 * @returns users with most followers
 */
router.get('/followers', (req:express.Request, res:express.Response) => {
    personDAO.getPersonsWithMostFollowers(
    ).then((response:ResponseObject<PersonName[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Recommand users with the most amount of same hashtags
 * @param id_person Id of the person wanting recommandations
 * @returns users with the most amount of same hashtags
 */
router.get('/hashtag/:id_person', (req:express.Request, res:express.Response) => {
    personDAO.getPersonsWithSimilarHashtags(
        parseInt(req.params.id_person)
    ).then((response:ResponseObject<PersonName[]>) => {
        res.status(constants.SUCCESS_CODE.OK).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Create a person
 * @param person Person to create
 * @returns ID of the newly created person
 */
router.post('/', (req:express.Request, res:express.Response) => {
    personDAO.createPerson(
        req.body
    ).then((response:ResponseObject<number|null>) => {
        if (response.err==='NO' && response.response!==null) req.session.id_person = response.response;
        res.status(constants.SUCCESS_CODE.CREATED).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Update a person
 * @param person Person to update
 */
router.put('/', authMiddleware, (req:express.Request, res:express.Response) => {
    personDAO.updatePerson(
        req.body
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.WITHOUT_CONTENT).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Update the password of a person
 * @param id_person ID of the person wanting to update its password
 * @param oldpassword_person Old password (must be correct)
 * @param newpassword_person New password
 */
router.put('/password', authMiddleware, (req:express.Request, res:express.Response) => {
    personDAO.updatePassword(
        req.body.id_person, 
        req.body.oldpassword_person, 
        req.body.newpassword_person
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.WITHOUT_CONTENT).json(response).end();
    }).catch((err) => {
        console.log(err);
        res.status(constants.ERROR_CODE.SERVER).end();
    });
});

/**
 * Delete a person
 * @param id_person ID of the person to delete
 */
router.delete('/', authMiddleware, (req:express.Request, res:express.Response) => {
    personDAO.deletePerson(
        req.body.id_person
    ).then((response:ResponseObject<null>) => {
        res.status(constants.SUCCESS_CODE.WITHOUT_CONTENT).json(response).end();
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
router.get('/profile_picture/:id_person', (req:express.Request, res:express.Response) => {
    res.writeHead(constants.SUCCESS_CODE.OK, {'Content-type': 'image/png'});
    fs.access(`./uploads/profiles/${req.params.id_person}.png`, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.readFile(`./uploads/profiles/${req.params.id_person}.png`, (error, content) => {
                res.end(content);
            });
        }
        else{
            fs.readFile('./uploads/profiles/0.png', (error, content) => {
                res.end(content);
            });
        }
    });
});
// Upload
router.post('/profile_picture/:id_person', authMiddleware, uploadImage.single('image'), (req, res) => {
    sharp(req.file?.buffer)
        .resize(1200,1200, {fit:'inside'})
        .png()
        .toFile(`./uploads/profiles/${req.params.id_person}.png`)
        .then(() => {
            res.status(constants.SUCCESS_CODE.OK).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(constants.ERROR_CODE.SERVER).end();
        });
});

module.exports = router;
