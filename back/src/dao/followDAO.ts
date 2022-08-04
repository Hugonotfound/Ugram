import db from '../config/sequelize';
import { PersonName } from '../types/person';
import { ResponseObject } from '../types/request';
import notificationDAO from './notificationDAO';

/**
 * Check if a person is subscribed to another
 * @param id_person 
 * @param id_person_tocheck 
 * @returns boolean
 */
function isSubscribedTo(id_person:number, id_person_tocheck:number) : Promise<ResponseObject<boolean>> {
    return new Promise((resolve, reject) => {
        db.Follow.findOne({
            where:{
                id_person_following: id_person,
                id_person_followed: id_person_tocheck
            }
        }).then((res:any) => {
            resolve({response:(res!==null), err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get a person subscriptions number
 * @param id_person 
 * @returns Number of subscriptions
 */
function countSubscriptions(id_person:number) : Promise<ResponseObject<number>> {
    return new Promise((resolve, reject) => {
        db.Follow.count({
            where:{id_person_following:id_person}
        }).then((res:number) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get a person followers number
 * @param id_person 
 * @returns Number of followers
 */
function countFollowers(id_person:number) : Promise<ResponseObject<number>> {
    return new Promise((resolve, reject) => {
        db.Follow.count({
            where:{id_person_followed:id_person}
        }).then((res:number) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get a person subscriptions names
 * @param id_person 
 * @returns ID, lastname and forname of the subscriptions
 */
function getSubscriptions(id_person:number) : Promise<ResponseObject<PersonName[]>> {
    return new Promise((resolve, reject) => {
        db.Follow.findAll({
            attributes: [],
            where: {id_person_following: id_person},
            include: [{
                model: db.Person,
                required: true,
                as: 'followed',
                attributes: ['id_person','lastname_person','forename_person']
            }]
        }).then((results:[{followed:PersonName}]) => {
            const finalResult:PersonName[] = [];
            results.forEach((result:{followed:PersonName})=>{
                finalResult.push(result.followed);
            });
            resolve({response:finalResult, err:'NO'});
        }).catch((err:Error) =>  reject(err));
    });
}

/**
 * Get a person followers names
 * @param id_person 
 * @returns ID, lastname and forname of the followers
 */
function getFollowers(id_person:number) : Promise<ResponseObject<PersonName[]>> {
    return new Promise((resolve, reject) => {
        db.Follow.findAll({
            attributes: [],
            where: {id_person_followed: id_person},
            include: [{
                model: db.Person,
                required: true,
                as: 'following',
                attributes: ['id_person','lastname_person','forename_person']
            }]
        }).then((results:[{following:PersonName}]) => {
            const finalResult:PersonName[] = [];
            results.forEach((result:{following:PersonName})=>{
                finalResult.push(result.following);
            });
            resolve({response:finalResult, err:'NO'});
        }).catch((err:Error) =>  reject(err));
    });
}

/**
 * Create a subscription from a person to a followed person
 * @param id_person Person wanting to subscribe
 * @param id_person_followed Person that will be followed
 */
function createSubscription(id_person:number, id_person_followed:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Follow.create({
            id_person_following: id_person,
            id_person_followed: id_person_followed
        }).then(() => {
            notificationDAO.createFromFollower(id_person, id_person_followed);
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Delete a subscription from a person to a followed person
 * @param id_person Person wanting to unsubscribe
 * @param id_person_followed Person that will be unfollowed
 */
function deleteSubscription(id_person:number, id_person_followed:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Follow.destroy({
            where: {
                id_person_following: id_person,
                id_person_followed: id_person_followed
            }
        }).then(() => {
            notificationDAO.deleteFromFollower(id_person, id_person_followed);
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Delete a follower
 * @param id_person Person wanting to delete a follower
 * @param id_person_following Follower
 */
function deleteFollower(id_person:number, id_person_following:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Follow.destroy({
            where: {
                id_person_following: id_person_following,
                id_person_followed: id_person
            }
        }).then(() => {
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

export default { 
    isSubscribedTo,
    countSubscriptions,
    countFollowers,
    getSubscriptions,
    getFollowers,
    createSubscription,
    deleteSubscription,
    deleteFollower
};