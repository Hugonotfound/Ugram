import db from '../config/sequelize';
import { PersonName } from '../types/person';
import { ResponseObject } from '../types/request';
import notificationDAO from './notificationDAO';

/**
 * Get the number of likes on a post
 * @param id_post 
 * @returns Number of likes on the post
 */
function count(id_post:number) : Promise<ResponseObject<number>> {
    return new Promise((resolve, reject) => {
        db.Likepost.count({
            where: {id_post: id_post}
        }).then((res:number) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get the names of the persons that have liked
 * @param id_post 
 * @returns ID, lastname and forname of every person who liked the post
 */
function getAllPersonsRelated(id_post:number) : Promise<ResponseObject<PersonName[]>> {
    return new Promise((resolve, reject) => {
        db.Person.findAll({
            attributes: ['id_person','lastname_person','forename_person'],
            include: [{
                model: db.Likepost,
                attributes: [],
                where: {id_post: id_post}
            }] 
        }).then((res:PersonName[]) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Create a like on a post
 * @param id_person ID of the person who liked the post
 * @param id_post ID of the post to like
 */
function createLikepost(id_person:number, id_post:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Likepost.create({
            id_person: id_person, 
            id_post: id_post
        }).then(() => {
            notificationDAO.createFromLikepost(id_person, id_post);
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Delete a like on a post
 * @param id_person ID of the person who liked the post
 * @param id_post ID of the liked post
 */
function deleteLikepost(id_person:number, id_post:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Likepost.destroy({
            where: {id_person: id_person, id_post: id_post}
        }).then(() => {
            notificationDAO.deleteFromLikepost(id_person, id_post);
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

export default { 
    count,
    getAllPersonsRelated,
    createLikepost,
    deleteLikepost
};