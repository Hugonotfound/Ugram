import { Op, Sequelize } from 'sequelize';

import db from '../config/sequelize';
import { Post } from '../types/post';
import { ResponseObject } from '../types/request';

import constants from '../constants/constants';
import hashtagDAO from './hashtagDAO';
import similaritiesDAO from './similaritiesDAO';

import * as fs from 'fs';

/**
 * Get a post by ID
 * @param id_post 
 * @returns Post with this ID
 */
function getById(id_post:number, authenticated_person_id?:number) : Promise<ResponseObject<Post>> {
    return new Promise((resolve, reject) => {
        db.Post.findByPk(id_post, {
            include: [
                {
                    model: db.Likepost,
                    attributes: ['id_person']
                },
                {
                    model: db.Comment,
                    attributes: ['id_post']
                },
                {
                    model: db.Person,
                    attributes: ['forename_person','lastname_person','username_person']
                },
                {
                    model: db.Posthashtag,
                    attributes: ['id_hashtag'],
                    include: [
                        {
                            model: db.Hashtag,
                            attributes: ['name_hashtag'],
                        }
                    ]
                }
            ]
        }).then((res:any) => {
            let hashtags = '';
            res.Posthashtags.forEach((Posthashtag:any) => hashtags+=`#${Posthashtag.Hashtag.name_hashtag} `);
            let isLiked = false;
            res.Likeposts.forEach((Likepost:{id_person:number}) => {
                if(Likepost.id_person===authenticated_person_id) isLiked = true;
            });
            resolve({response:{
                id_post: res.id_post,
                person: {id_person: res.id_person, forename_person:res.Person.forename_person, lastname_person:res.Person.lastname_person, username_person:res.Person.username_person},
                isliked_post: isLiked,
                likes_post: res.Likeposts.length,
                comments_post: res.Comments.length,
                hashtags_post: hashtags,
                caption_post: res.caption_post,
                created_at: res.created_at,
                updated_at: res.updated_at
            }, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get posts from a person
 * @param id_person ID of the person who has posted the post
 * @param offset Offset in the returned list
 * @returns Posts of a person
 */
function getByPerson(id_person:number, offset:number, authenticated_person_id?:number) : Promise<ResponseObject<Post[]>> {
    return new Promise((resolve, reject) => {
        db.Post.findAll({
            where: {id_person: id_person},
            order: [['updated_at', 'DESC']],
            limit: constants.QUERIES_LIMIT,
            offset: offset,
            include: [
                {
                    model: db.Likepost,
                    attributes: ['id_person']
                },
                {
                    model: db.Comment,
                    attributes: ['id_post']
                },
                {
                    model: db.Person,
                    attributes: ['forename_person','lastname_person','username_person']
                },
                {
                    model: db.Posthashtag,
                    attributes: ['id_hashtag'],
                    include: [
                        {
                            model: db.Hashtag,
                            attributes: ['name_hashtag'],
                        }
                    ]
                }
            ]
        }).then((ress:any[]) => {
            const response:Post[] = [];
            ress.forEach((res:any) => {
                let hashtags = '';
                res.Posthashtags.forEach((Posthashtag:any) => hashtags+=`#${Posthashtag.Hashtag.name_hashtag} `);
                let isLiked = false;
                res.Likeposts.forEach((Likepost:{id_person:number}) => {
                    if(Likepost.id_person===authenticated_person_id) isLiked = true;
                });
                response.push({
                    id_post: res.id_post,
                    person: {id_person: res.id_person, forename_person:res.Person.forename_person, lastname_person:res.Person.lastname_person, username_person:res.Person.username_person},
                    isliked_post: isLiked,
                    likes_post: res.Likeposts.length,
                    comments_post: res.Comments.length,
                    hashtags_post: hashtags,
                    caption_post: res.caption_post,
                    created_at: res.created_at,
                    updated_at: res.updated_at
                });
            });
            resolve({response:response, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get post by hashtag id
 * @param id_hashtag 
 * @returns Posts with this hashtag
 */
function getByHashtag(id_hashtag:number, authenticated_person_id?:number) : Promise<ResponseObject<Post[]>> {
    return new Promise((resolve, reject) => {
        db.Post.findAll({
            order: [['updated_at', 'DESC']],
            limit: constants.QUERIES_LIMIT,
            include: [
                {
                    model: db.Likepost,
                    attributes: ['id_person']
                },
                {
                    model: db.Comment,
                    attributes: ['id_post']
                },
                {
                    model: db.Person,
                    attributes: ['forename_person','lastname_person','username_person']
                },
                {
                    model: db.Posthashtag,
                    attributes: ['id_hashtag'],
                    include: [
                        {
                            model: db.Hashtag,
                            attributes: ['name_hashtag'],
                            where: {id_hashtag: id_hashtag}
                        }
                    ]
                }
            ]
        }).then((ress:any[]) => {
            const response:Post[] = [];
            ress.forEach((res:any) => {
                let hashtags = '';
                res.Posthashtags.forEach((Posthashtag:any) => hashtags+=`#${Posthashtag.Hashtag.name_hashtag} `);
                let isLiked = false;
                res.Likeposts.forEach((Likepost:{id_person:number}) => {
                    if(Likepost.id_person===authenticated_person_id) isLiked = true;
                });
                response.push({
                    id_post: res.id_post,
                    person: {id_person: res.id_person, forename_person:res.Person.forename_person, lastname_person:res.Person.lastname_person, username_person:res.Person.username_person},
                    isliked_post: isLiked,
                    likes_post: res.Likeposts.length,
                    comments_post: res.Comments.length,
                    hashtags_post: hashtags,
                    caption_post: res.caption_post,
                    created_at: res.created_at,
                    updated_at: res.updated_at
                });
            });
            resolve({response:response, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get most recent posts
 * @param offset Offset in the returned list
 * @returns Most recent posts
 */
function getByDate(offset:number, authenticated_person_id?:number) : Promise<ResponseObject<Post[]>> {
    return new Promise((resolve, reject) => {
        db.Post.findAll({
            order: [['updated_at', 'DESC']],
            limit: constants.QUERIES_LIMIT,
            offset: offset,
            include: [
                {
                    model: db.Likepost,
                    attributes: ['id_person']
                },
                {
                    model: db.Comment,
                    attributes: ['id_post']
                },
                {
                    model: db.Person,
                    attributes: ['forename_person','lastname_person','username_person']
                },
                {
                    model: db.Posthashtag,
                    attributes: ['id_hashtag'],
                    include: [
                        {
                            model: db.Hashtag,
                            attributes: ['name_hashtag'],
                        }
                    ]
                }
            ]
        }).then((ress:any[]) => {
            const response:Post[] = [];
            ress.forEach((res:any) => {
                let hashtags = '';
                res.Posthashtags.forEach((Posthashtag:any) => hashtags+=`#${Posthashtag.Hashtag.name_hashtag} `);
                let isLiked = false;
                res.Likeposts.forEach((Likepost:{id_person:number}) => {
                    if(Likepost.id_person===authenticated_person_id) isLiked = true;
                });
                response.push({
                    id_post: res.id_post,
                    person: {id_person: res.id_person, forename_person:res.Person.forename_person, lastname_person:res.Person.lastname_person, username_person:res.Person.username_person},
                    isliked_post: isLiked,
                    likes_post: res.Likeposts.length,
                    comments_post: res.Comments.length,
                    hashtags_post: hashtags,
                    caption_post: res.caption_post,
                    created_at: res.created_at,
                    updated_at: res.updated_at
                });
            });
            resolve({response:response, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get post randomly
 * @param offset Offset in the returned list
 * @returns Random posts
 */
function getRandomly(offset:number, authenticated_person_id?:number) : Promise<ResponseObject<Post[]>> {
    return new Promise((resolve, reject) => {
        db.Post.findAll({
            order: Sequelize.literal('rand()'),
            limit: constants.QUERIES_LIMIT,
            offset: offset,
            include: [
                {
                    model: db.Likepost,
                    attributes: ['id_person']
                },
                {
                    model: db.Comment,
                    attributes: ['id_post']
                },
                {
                    model: db.Person,
                    attributes: ['forename_person','lastname_person','username_person']
                },
                {
                    model: db.Posthashtag,
                    attributes: ['id_hashtag'],
                    include: [
                        {
                            model: db.Hashtag,
                            attributes: ['name_hashtag'],
                        }
                    ]
                }
            ]
        }).then((ress:any[]) => {
            const response:Post[] = [];
            ress.forEach((res:any) => {
                let hashtags = '';
                res.Posthashtags.forEach((Posthashtag:any) => hashtags+=`#${Posthashtag.Hashtag.name_hashtag} `);
                let isLiked = false;
                res.Likeposts.forEach((Likepost:{id_person:number}) => {
                    if(Likepost.id_person===authenticated_person_id) isLiked = true;
                });
                response.push({
                    id_post: res.id_post,
                    person: {id_person: res.id_person, forename_person:res.Person.forename_person, lastname_person:res.Person.lastname_person, username_person:res.Person.username_person},
                    isliked_post: isLiked,
                    likes_post: res.Likeposts.length,
                    comments_post: res.Comments.length,
                    hashtags_post: hashtags,
                    caption_post: res.caption_post,
                    created_at: res.created_at,
                    updated_at: res.updated_at
                });
            });
            resolve({response:response, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get most recent posts of a person subscriptions
 * @param id_person ID of the authenticated person
 * @param offset Offset in the returned list
 * @returns Most recent posts of followed accounts
 */
function getByDateSubscriptionsOnly(offset:number, authenticated_person_id?:number) : Promise<ResponseObject<Post[]>> {
    return new Promise((resolve, reject) => {
        // Get subscriptions IDs
        db.Follow.findAll({
            attributes: [],
            where: {id_person_following: authenticated_person_id},
            include: [
                {
                    model: db.Person,
                    required: true,
                    as: 'followed',
                    attributes: ['id_person']
                }
            ]
        }).then((results: [{followed:{id_person:number}}]) => {
            // Create an array with the IDs of all the followed persons
            const subscriptionsID:number[] = [];
            results.forEach((result)=>{
                subscriptionsID.push(result.followed.id_person);
            });
            // Find all posts done by the followed persons
            db.Post.findAll({
                where: {id_person: {[Op.in] : subscriptionsID}},
                order: [['updated_at', 'DESC']],
                limit: constants.QUERIES_LIMIT,
                offset: offset,
                include: [
                    {
                        model: db.Likepost,
                        attributes: ['id_person']
                    },
                    {
                        model: db.Comment,
                        attributes: ['id_post']
                    },
                    {
                        model: db.Person,
                        attributes: ['forename_person','lastname_person','username_person']
                    },
                    {
                        model: db.Posthashtag,
                        attributes: ['id_hashtag'],
                        include: [
                            {
                                model: db.Hashtag,
                                attributes: ['name_hashtag'],
                            }
                        ]
                    }
                ]
            }).then((ress:any[]) => {
                const response:Post[] = [];
                ress.forEach((res:any) => {
                    let hashtags = '';
                    res.Posthashtags.forEach((Posthashtag:any) => hashtags+=`#${Posthashtag.Hashtag.name_hashtag} `);
                    let isLiked = false;
                    res.Likeposts.forEach((Likepost:{id_person:number}) => {
                        if(Likepost.id_person===authenticated_person_id) isLiked = true;
                    });
                    response.push({
                        id_post: res.id_post,
                        person: {id_person: res.id_person, forename_person:res.Person.forename_person, lastname_person:res.Person.lastname_person, username_person:res.Person.username_person},
                        isliked_post: isLiked,
                        likes_post: res.Likeposts.length,
                        comments_post: res.Comments.length,
                        hashtags_post: hashtags,
                        caption_post: res.caption_post,
                        created_at: res.created_at,
                        updated_at: res.updated_at
                    });
                });
                resolve({response:response, err:'NO'});
            }).catch((err:Error) =>  reject(err));
        }).catch((err:Error) =>  reject(err));
    });
}

/**
 * Create a post
 * @param post Post to create
 * @returns ID of the newly created post
 */
function createPost(post:{id_person:number, hashtags_post?: string, caption_post: string}) : Promise<ResponseObject<number>> {
    return new Promise((resolve, reject) => {
        db.Post.create({
            id_person: post.id_person,
            caption_post: post.caption_post
        }).then((resPost:Post) => {
            if (post.hashtags_post){
                hashtagDAO.createPostHashtags(resPost.id_post, post.hashtags_post).then((hashtags:number[]) => {
                    similaritiesDAO.updateOnPost({id_post:resPost.id_post, id_person:post.id_person, hashtags:hashtags});
                    resolve({response:resPost.id_post, err:'NO'});
                }).catch((err:Error) => reject(err));
            }
            else resolve({response:resPost.id_post, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Update a post
 * @param postPost to update
 */
function updatePost(post:{id_post:number, id_person:number, caption_post:string, hashtags_post:string}) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Post.update({
            id_post: post.id_post,
            id_person: post.id_person,
            caption_post: post.caption_post
        }
        ,{
            where: {id_post: post.id_post}
        }
        ).then(() => {
            if (post.hashtags_post){
                hashtagDAO.deleteAllPostHashtags(post.id_post).then(() => {
                    hashtagDAO.createPostHashtags(post.id_post, post.hashtags_post).then((hashtags:number[]) => {
                        similaritiesDAO.updateOnPost({id_post:post.id_post, id_person:post.id_person, hashtags:hashtags});
                        resolve({response:null, err:'NO'});
                    }).catch((err:Error) => reject(err));
                }).catch((err:Error) => reject(err));
            }
            else resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Delete a post
 * @param id_post ID of the post to delete
 */
function deletePost(id_post:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Post.destroy({
            where: {id_post: id_post}
        }).then(() => {
            fs.unlink(`./uploads/posts/${id_post}.png`, (err:any) => {
                if (err) console.log(err);
            });
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

export default { 
    getById,
    getByPerson, 
    getRandomly,
    getByHashtag,
    getByDate,
    getByDateSubscriptionsOnly,
    createPost,
    updatePost,
    deletePost
};
