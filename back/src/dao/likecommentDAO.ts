import db from '../config/sequelize';
import { PersonName } from '../types/person';
import { ResponseObject } from '../types/request';
import notificationDAO from './notificationDAO';

/**
 * Get the number of likes on a comment
 * @param id_comment 
 * @returns Number of likes on the comment
 */
function count(id_comment:number) : Promise<ResponseObject<number>> {
    return new Promise((resolve, reject) => {
        db.Likecomment.count({
            where: {id_comment: id_comment}
        }).then((res:number) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get the names of the persons that have liked
 * @param id_comment 
 * @returns ID, lastname and forname of every person who liked the comment
 */
function getAllPersonsRelated(id_comment:number) : Promise<ResponseObject<PersonName[]>> {
    return new Promise((resolve, reject) => {
        db.Person.findAll({
            attributes: ['id_person','lastname_person','forename_person'],
            include: [{
                model: db.Likecomment,
                attributes: [],
                where: {id_comment: id_comment}
            }] 
        }).then((res:PersonName[]) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Create a like on a comment
 * @param id_person ID of the person who liked the comment
 * @param id_comment ID of the comment to like
 */
function createLikecomment(id_person:number, id_comment:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Likecomment.create({
            id_person: id_person,
            id_comment: id_comment
        }).then(() => {
            notificationDAO.createFromLikecomment(id_person, id_comment);
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Delete a like on a comment
 * @param id_person ID of the person who liked the comment
 * @param id_comment ID of the liked comment
 */
function deleteLikecomment(id_person:number, id_comment:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Likecomment.destroy({
            where: {id_person: id_person, id_comment: id_comment}
        }).then(() => {
            notificationDAO.deleteFromLikecomment(id_person, id_comment);
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

export default { 
    count,
    getAllPersonsRelated,
    createLikecomment,
    deleteLikecomment
};