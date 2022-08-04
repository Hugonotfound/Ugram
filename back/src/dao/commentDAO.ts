import db from '../config/sequelize';
import { Comment } from '../types/comment';
import { ResponseObject } from '../types/request';

import constants from '../constants/constants';
import notificationDAO from './notificationDAO';

/**
 * Get a comment by ID
 * @param id_comment
 * @returns The identified comment
 */
function getById(id_comment:number) : Promise<ResponseObject<Comment>> {
    return new Promise((resolve, reject) => {
        db.Comment.findByPk(
            id_comment
        ).then((res:Comment) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get number of comments on a post
 * @param id_post 
 * @returns Number of comments on the post
 */
function countByPost(id_post:number) : Promise<ResponseObject<number>> {
    return new Promise((resolve, reject) => {
        db.Comment.count({
            where: {id_post: id_post}
        }).then((res:number) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get comments from a person
 * @param id_person ID of the person who has posted the comments
 * @param offset Offset in the returned list
 * @returns Comments from the person
 */
function getByPerson(id_person:number, offset:number) : Promise<ResponseObject<Comment[]>> {
    return new Promise((resolve, reject) => {
        db.Comment.findAll({
            where: {id_person: id_person},
            order: [['updated_at', 'DESC']],
            limit: constants.QUERIES_LIMIT,
            offset: offset
        }).then((res:Comment[]) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get comments related to a post
 * @param id_post 
 * @param offset Offset in the returned list
 * @returns Comments related to this post
 */
function getByPost(id_post:number, authenticated_person_id?:number) : Promise<ResponseObject<Comment[]>> {
    return new Promise((resolve, reject) => {
        db.Comment.findAll({
            where: {id_post: id_post},
            attributes: {exclude: ['id_person']},
            include:[
                {
                    model: db.Person,
                    attributes: ['id_person','lastname_person','forename_person','username_person']
                },
                {
                    model: db.Likecomment,
                    attributes: ['id_person']
                }
            ],
            order: [['updated_at', 'ASC']],
            limit: constants.QUERIES_LIMIT
        }).then((ress:any) => {
            const response:Comment[] = [];
            ress.forEach((res:any) => {
                let isLiked = false;
                res.Likecomments.forEach((Likecomment:{id_person:number}) => {
                    if(Likecomment.id_person===authenticated_person_id) isLiked = true;
                });
                response.push({
                    id_comment: res.id_comment,
                    id_post: res.id_post,
                    person: res.Person,
                    isliked_comment: isLiked,
                    likes_comment: res.Likecomments.length,
                    text_comment: res.text_comment,
                    created_at: res.created_at,
                    updated_at: res.updated_at
                });
            });
            resolve({response:response, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Create a comment
 * @param comment Comment to create
 * @returns ID of the newly created comment
 */
function createComment(id_post:number, id_person:number, text_comment:string) : Promise<ResponseObject<number|null>> {
    return new Promise((resolve, reject) => {
        db.Comment.create({
            id_post: id_post,
            id_person: id_person,
            text_comment: text_comment
        }).then((res:Comment) => {
            notificationDAO.createFromComment(id_person, id_post, res.id_comment);
            resolve({response:res.id_comment, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Update a comment
 * @param comment Comment to update
 */
function updateComment(comment:Comment) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Comment.update(comment,{
            where: {id_comment: comment.id_comment}
        }).then(() => {
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Delete a comment
 * @param id_comment ID of the comment to delete
 */
function deleteComment(id_comment:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        notificationDAO.deleteFromComment(id_comment).then(() => {
            db.Comment.destroy({
                where: {id_comment: id_comment}
            }).then(() => {
                resolve({response:null, err:'NO'});
            }).catch((err:Error) => reject(err));
        });
    });
}

export default { 
    getById,
    getByPerson,
    countByPost,
    getByPost,
    createComment,
    updateComment,
    deleteComment
};