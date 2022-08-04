import db from '../config/sequelize';
import { Op } from 'sequelize';

import { Hashtag, PersonHashtags } from '../types/hashtag';
import { ResponseObject } from '../types/request';
import constants from '../constants/constants';

/**
 * Search hashtag
 * @param search_text
 * @returns Hashtags corresponding to the search
 */
function searchHashtags(search_text:string) : Promise<ResponseObject<Hashtag[]>> {
    return new Promise((resolve, reject) => {
        let treatedSearchText = search_text.replace(/\s/g, '').toLowerCase();
        treatedSearchText = (treatedSearchText.split('#')[0].length!==0) ? treatedSearchText.split('#')[0] : treatedSearchText.split('#')[1];
        db.Hashtag.findAll({
            where: {name_hashtag: {[Op.startsWith]:treatedSearchText}}
        }).then((hashtags:Hashtag[]) => {
            resolve({response:hashtags, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
} 

/**
 * Get more oftenly used hashtags
 * @returns More oftenly used hashtags with the number of occurrences
 */
function moreOftenlyUsedHashtags() : Promise<ResponseObject<Hashtag[]>> {
    return new Promise((resolve, reject) => {
        db.Hashtag.findAll({
            subQuery: false,
            attributes: { 
                //include: [[db.Sequelize.fn('COUNT', db.Sequelize.col('Posthashtags.id_hashtag')), 'occurrences_hashtag']],
                exclude: ['created_at','updated_at']
            },
            include: [{
                model: db.Posthashtag, 
                attributes: []
            }],
            limit: constants.QUERIES_LIMIT,
            group: ['Hashtag.id_hashtag'],
            having: db.Sequelize.where(db.Sequelize.fn('COUNT', db.Sequelize.col('Posthashtags.id_hashtag')), Op.gt, 0),
            order: [[db.Sequelize.fn('COUNT', db.Sequelize.col('Posthashtags.id_hashtag')), 'DESC']]
        }).then((hashtags:any) => {
            resolve({response:hashtags, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
} 

/**
 * Get all hashtags linked to a person
 * @returns List of used hashtags linked to a person
 */
function getPersonsHashtags() : Promise<PersonHashtags[]> {
    return new Promise((resolve, reject) => {
        db.Person.findAll(
            {
                attributes: ['id_person','lastname_person','forename_person','username_person'],
                include: {
                    model: db.Post,
                    attributes: ['id_post'],
                    required: true,
                    include: {
                        model: db.Posthashtag,
                        attributes: ['id_hashtag'],
                        include: {
                            model: db.Hashtag,
                            attributes: ['name_hashtag']
                        }
                    }
                }
            }
        ).then((ress:any) => {
            const response:PersonHashtags[] = [];
            ress.forEach((res:any) => {
                const hashtagsMap:Map<number,{id_hashtag:number, name_hashtag:string, occurrences_hashtag:number}> = new Map<number,{id_hashtag:number, name_hashtag:string, occurrences_hashtag:number}>();
                res.Posts.forEach((Post:any) => {
                    Post.Posthashtags.forEach((Posthashtag:any) => {
                        const hashtagAtIndex = hashtagsMap.get(Posthashtag.id_hashtag);
                        if (!hashtagAtIndex){
                            hashtagsMap.set(
                                Posthashtag.id_hashtag, 
                                {
                                    id_hashtag:Posthashtag.id_hashtag, 
                                    name_hashtag:Posthashtag.Hashtag.name_hashtag, 
                                    occurrences_hashtag:1
                                }
                            );
                        }
                        else{
                            hashtagsMap.set(
                                Posthashtag.id_hashtag, 
                                {
                                    id_hashtag:Posthashtag.id_hashtag, 
                                    name_hashtag:Posthashtag.Hashtag.name_hashtag, 
                                    occurrences_hashtag:hashtagAtIndex.occurrences_hashtag+1
                                }
                            );
                        }
                    });
                });
                response.push({
                    id_person: res.id_person,
                    forename_person: res.forename_person,
                    lastname_person: res.lastname_person,
                    username_person: res.username_person,
                    hashtags: [...hashtagsMap.values()]
                });
            });
            resolve(response);
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Create hashtags and link them to the post if they don't exist yet
 * @param id_post 
 * @param hashtags 
 */
function createPostHashtags(id_post:number, hashtags:string) : Promise<number[]> {
    return new Promise((resolve, reject) => {
        const promiseArray:Promise<number>[] = [];
        // For each hashtag in the string (duplicates removed with a set)
        [...new Set(hashtags.replace(/\s/g, '').toLowerCase().split('#'))].forEach((lowerCaseHashtagName:string) => {
            if (lowerCaseHashtagName.length>0){
                promiseArray.push(
                    new Promise((rslv, rjct) => {
                        // Check if the hashtags already exists
                        db.Hashtag.findOne({
                            where: {name_hashtag: lowerCaseHashtagName}
                        }).then((resHashtagFind:Hashtag) => {
                            // If it exists, link it with the post
                            if (resHashtagFind){
                                db.Posthashtag.create({
                                    id_post: id_post,
                                    id_hashtag: resHashtagFind.id_hashtag
                                }).then(() => {
                                    rslv(resHashtagFind.id_hashtag);
                                }).catch((err:Error) => rjct(err));
                            }
                            // If it doesn't exists, create it then link it with the post
                            else{
                                db.Hashtag.create({
                                    name_hashtag: lowerCaseHashtagName
                                }).then((resHashtagCreate:Hashtag) => {
                                    db.Posthashtag.create({
                                        id_post: id_post,
                                        id_hashtag: resHashtagCreate.id_hashtag
                                    }).then(() => {
                                        rslv(resHashtagCreate.id_hashtag);
                                    }).catch((err:Error) => rjct(err));
                                }).catch((err:Error) => rjct(err));
                            }
                        }).catch((err:Error) => reject(err));
                    })
                );
            }
        });
        // Resolve promises
        Promise.all(promiseArray).then((res:number[]) => {
            resolve(res);
        });
    });
}

/**
 * Delete all hashtags related to a post in the posthashtag table
 * @param id_post
 */
function deleteAllPostHashtags(id_post:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Posthashtag.destroy({
            where: {id_post: id_post}
        }).then(() => {
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => {
            reject(err);
        });
    });
}

export default { 
    searchHashtags,
    moreOftenlyUsedHashtags,
    getPersonsHashtags,
    createPostHashtags,
    deleteAllPostHashtags
};