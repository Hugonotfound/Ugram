import db from '../config/sequelize';
import { Notification } from '../types/notification';
import { ResponseObject } from '../types/request';

/**
 * Get the number of notifications of a person
 * @param id_person 
 * @returns 
 */
function countByPersonReceiving(id_person?:number) : Promise<ResponseObject<number|null>> {
    return new Promise((resolve, reject) => {
        if (!id_person) resolve({response:null, err:'AUTHENTICATION'});
        db.Notification.count({
            where: {
                id_person_receiving: id_person,
                isread_notification: false
            }
        }).then((res:number) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get notifications of a person
 * @param id_person 
 * @returns 
 */
function getByPersonReceiving(id_person?:number) : Promise<ResponseObject<Notification[]>> {
    return new Promise((resolve, reject) => {
        if (!id_person) resolve({response:[], err:'AUTHENTICATION'});
        else db.Notification.findAll({
            where: {id_person_receiving: id_person},
            include: [
                {
                    model: db.Person,
                    as: 'sending',
                    attributes: ['id_person','lastname_person','forename_person','username_person']
                },
                {
                    model: db.Post,
                    attributes: ['id_post','caption_post']
                }
            ],
            order: [['created_at','DESC']]
        }).then((ress:any) => {
            const response:Notification[] = [];
            ress.forEach((res:any) => {
                response.push({
                    id_notification: res.id_notification,
                    id_person_receiving: res.id_person_receiving,
                    person_sending: res.sending,
                    type_notification: res.type_notification,
                    isread_notification: res.isread_notification,
                    post: res.Post,
                    id_comment: res.id_comment,
                    created_at: res.created_at
                });
            });
            resolve({response:response, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Read the notification
 * @param id_notification 
 * @returns 
 */
function readNotification(id_notification:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Notification.update(
            {
                isread_notification: true
            },
            {
                where: {id_notification: id_notification}
            }
        ).then(() => {
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Create a notification from likepost creation
 * @param id_post 
 * @param id_person_receiving 
 * @param id_person_sending 
 */
function createFromLikepost(id_person_sending:number, id_post:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Post.findByPk(
            id_post
        ).then((resPost:any) => {
            db.Notification.findOne({
                where: {
                    id_person_receiving: resPost.id_person,
                    id_person_sending: id_person_sending,
                    type_notification: 'LIKEPOST',
                    id_post: id_post
                }
            }).then((resNotification:any) => {
                if (resNotification!==null) return resolve({response:null, err:'OTHER'});
                else db.Notification.create(
                    {
                        id_person_receiving: resPost.id_person,
                        id_person_sending: id_person_sending,
                        type_notification: 'LIKEPOST',
                        isread_notification: false,
                        id_post: id_post,
                        id_comment: null
                    }
                ).then(() => {
                    resolve({response:null, err:'NO'});
                }).catch((err:Error) => reject(err));
            }).catch((err:Error) => reject(err));
        }).catch((err:Error) => reject(err));
    });
}
/**
 * Delete a notification from likepost deletion
 * @param id_person_sending 
 * @param id_post 
 */
function deleteFromLikepost(id_person_sending:number, id_post:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Post.findByPk(
            id_post
        ).then((resPost:any) => {
            db.Notification.destroy({
                where: {
                    id_person_receiving: resPost.id_person,
                    id_person_sending: id_person_sending,
                    type_notification: 'LIKEPOST',
                    id_post: id_post
                }
            }).then(() => {
                resolve({response:null, err:'NO'});
            }).catch((err:Error) => reject(err));
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Create a notification from comment creation
 * @param id_person_sending 
 * @param id_post 
 * @param id_comment 
 */
function createFromComment(id_person_sending:number, id_post:number, id_comment:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Post.findByPk(
            id_post
        ).then((resPost:any) => {
            db.Notification.findOne({
                where: {
                    id_person_receiving: resPost.id_person,
                    id_person_sending: id_person_sending,
                    type_notification: 'COMMENT',
                    id_post: id_post,
                    id_comment: id_comment
                }
            }).then((resNotification:any) => {
                if (resNotification!==null) return resolve({response:null, err:'OTHER'});
                else db.Notification.create(
                    {
                        id_person_receiving: resPost.id_person,
                        id_person_sending: id_person_sending,
                        type_notification: 'COMMENT',
                        isread_notification: false,
                        id_post: id_post,
                        id_comment: id_comment
                    }
                ).then(() => {
                    resolve({response:null, err:'NO'});
                }).catch((err:Error) => reject(err));
            }).catch((err:Error) => reject(err));
        }).catch((err:Error) => reject(err));
    });
}
/**
 * Delete a notification from comment deletion
 * @param id_comment 
 */
function deleteFromComment(id_comment:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Comment.findByPk(id_comment, {
            include: {
                model: db.Post
            }
        }).then((resComment:any) => {
            db.Notification.destroy({
                where: {
                    id_person_receiving: resComment.Post.id_person,
                    id_person_sending: resComment.id_person,
                    type_notification: 'COMMENT',
                    id_post: resComment.id_post,
                    id_comment: id_comment
                }
            }).then(() => {
                resolve({response:null, err:'NO'});
            }).catch((err:Error) => reject(err));
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Create a notification from likecomment creation
 * @param id_person_sending 
 * @param id_comment 
 */
function createFromLikecomment(id_person_sending:number, id_comment:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Comment.findByPk(id_comment, {
            include: {
                model: db.Post
            }
        }).then((resComment:any) => {
            db.Notification.findOne({
                where: {
                    id_person_receiving: resComment.Post.id_person,
                    id_person_sending: id_person_sending,
                    type_notification: 'LIKECOMMENT',
                    id_post: resComment.id_post,
                    id_comment: id_comment
                }
            }).then((resNotification:any) => {
                if (resNotification!==null) return resolve({response:null, err:'OTHER'});
                else db.Notification.create(
                    {
                        id_person_receiving: resComment.Post.id_person,
                        id_person_sending: id_person_sending,
                        type_notification: 'LIKECOMMENT',
                        isread_notification: false,
                        id_post: resComment.id_post,
                        id_comment: id_comment
                    }
                ).then(() => {
                    resolve({response:null, err:'NO'});
                }).catch((err:Error) => reject(err));
            }).catch((err:Error) => reject(err));
        }).catch((err:Error) => reject(err));
    });
}
/**
 * Delete a notification from likecomment deletion
 * @param id_comment 
 */
function deleteFromLikecomment(id_person_sending:number, id_comment:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Comment.findByPk(id_comment,{
            include: {
                model: db.Post
            }
        }).then((resComment:any) => {
            db.Notification.destroy({
                where: {
                    id_person_receiving: resComment.Post.id_person,
                    id_person_sending: id_person_sending,
                    type_notification: 'LIKECOMMENT',
                    id_post: resComment.id_post,
                    id_comment: id_comment
                }
            }).then(() => {
                resolve({response:null, err:'NO'});
            }).catch((err:Error) => reject(err));
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Create a notification from a follow
 * @param id_person_sending 
 * @param id_person_receiving
 */
function createFromFollower(id_person_sending:number, id_person_receiving:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Notification.findOne({
            where: {
                id_person_receiving: id_person_receiving,
                id_person_sending: id_person_sending,
                type_notification: 'FOLLOWER'
            }
        }).then((resNotification:any) => {
            if (resNotification!==null) return resolve({response:null, err:'OTHER'});
            else db.Notification.create(
                {
                    id_person_receiving: id_person_receiving,
                    id_person_sending: id_person_sending,
                    type_notification: 'FOLLOWER',
                    isread_notification: false,
                    id_post: null,
                    id_comment: null
                }
            ).then(() => {
                resolve({response:null, err:'NO'});
            }).catch((err:Error) => reject(err));
        }).catch((err:Error) => reject(err));
    });
}
/**
 * Delete a notification from an unfollow
 * @param id_person_sending 
 * @param id_person_receiving
 */
function deleteFromFollower(id_person_sending:number, id_person_receiving:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Notification.destroy({
            where: {
                id_person_receiving: id_person_receiving,
                id_person_sending: id_person_sending,
                type_notification: 'FOLLOWER'
            }
        }).then(() => {
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

export default { 
    countByPersonReceiving,
    getByPersonReceiving,
    readNotification,
    createFromLikepost,
    deleteFromLikepost,
    createFromComment,
    deleteFromComment,
    createFromLikecomment,
    deleteFromLikecomment,
    createFromFollower,
    deleteFromFollower
};