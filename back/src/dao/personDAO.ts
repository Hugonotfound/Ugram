import { Op } from 'sequelize';

import db from '../config/sequelize';
import { Person, PersonName, PersonWithFollow } from '../types/person';
import { ResponseObject } from '../types/request';

import constants from '../constants/constants';
import cryptoService from '../services/cryptoService';
import similaritiesDAO from './similaritiesDAO';
import followDAO from './followDAO';

import * as fs from 'fs';

/**
 * Get a person by ID
 * @param id_person 
 * @returns Person with this ID
 */
function getById(id_person:number) : Promise<ResponseObject<PersonWithFollow>> {
    return new Promise((resolve, reject) => {
        Promise.all([
            db.Person.findByPk(id_person, {
                attributes: {exclude: ['password_person']}
            }),
            followDAO.countFollowers(id_person),
            followDAO.countSubscriptions(id_person)
        ]).then((res:any) => {
            resolve({
                response:{
                    id_person: res[0].id_person,
                    lastname_person: res[0].lastname_person,
                    forename_person: res[0].forename_person,
                    gender_person: res[0].gender_person,
                    birthdate_person: res[0].birthdate_person,
                    username_person: res[0].username_person,
                    mail_person: res[0].mail_person,
                    phone_person: res[0].phone_person,
                    confidentiality_person: res[0].confidentiality_person,
                    displayonline_person: res[0].displayonline_person,
                    followersnumber_person: res[1].response,
                    followingnumber_person: res[2].response,
                    bio_person: res[0].bio_person,
                    created_at: res[0].created_at,
                    updated_at: res[0].updated_at
                }, 
                err:'NO'
            });
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Get every person, ordered by lastname
 * @param offset Offset in the returned list 
 * @returns Array of person
 */
function getAll(offset:number) : Promise<ResponseObject<Person[]>> {
    return new Promise((resolve, reject) => {
        db.Person.findAll({
            attributes: {exclude: ['password_person']},
            order: [['lastname_person', 'ASC']],
            offset: offset,
            limit: constants.QUERIES_LIMIT
        }).then((res:Person[]) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Search a person by name (lastname or forename)
 * @param search_text String of the search bar
 * @param offset Offset in the returned list
 * @returns Array of persons corresponding to the search
 */
function searchByName(search_text:string, offset:number) : Promise<ResponseObject<PersonName[]>> {
    const nameSplit = search_text.split(' ');
    let whereObject:any;
    if (nameSplit.length>1 && nameSplit[1].length>0){
        whereObject = {
            [Op.or]: {
                [Op.and]: [
                    {lastname_person:{[Op.startsWith]:nameSplit[0]}},
                    {forename_person:{[Op.startsWith]:nameSplit[1]}}
                ],
                [Op.and]: [
                    {lastname_person:{[Op.startsWith]:nameSplit[1]}},
                    {forename_person:{[Op.startsWith]:nameSplit[0]}}
                ]
            }
        };
    }
    else{
        whereObject = {
            [Op.or]: [
                {lastname_person:{[Op.startsWith]:search_text}},
                {forename_person:{[Op.startsWith]:search_text}},
                {username_person:{[Op.startsWith]:search_text}}
            ]
        };
    }
    return new Promise((resolve, reject) => {
        db.Person.findAll({
            attributes: ['id_person','lastname_person','forename_person','username_person'],
            where: whereObject,
            order: [['id_person', 'ASC']],
            limit: constants.QUERIES_LIMIT,
            offset: offset
        }).then((res:PersonName[]) => {
            resolve({response:res, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Recommand users with most followers
 * @returns users with most followers
 */
function getPersonsWithMostFollowers() : Promise<ResponseObject<PersonName[]>> {
    return new Promise((resolve, reject) => {
        db.Follow.findAll({            
            subQuery: false,
            attributes: { 
                include: [[db.Sequelize.fn('COUNT', db.Sequelize.col('followed.id_person')), 'occurrences_followers']],
                exclude: ['id_person_followed','id_person_following','created_at','updated_at']
            },
            include: [{
                model: db.Person,
                required: true,
                as: 'followed',
                attributes: ['id_person','lastname_person','forename_person','username_person']
            }],
            limit: 5,
            group: ['Follow.id_person_followed'],
            having: db.Sequelize.where(db.Sequelize.fn('COUNT', db.Sequelize.col('followed.id_person')), Op.gt, 0),
            order: [[db.Sequelize.fn('COUNT', db.Sequelize.col('followed.id_person')), 'DESC']]
        }).then((ress:any[]) => {
            const response:PersonName[] = [];
            ress.forEach((res:any) => {
                response.push({
                    id_person: res.followed.id_person,
                    lastname_person: res.followed.lastname_person,
                    forename_person: res.followed.forename_person,
                    username_person: res.followed.username_person
                });
            });
            resolve({response:response, err:'NO'});
        }).catch((err:Error) =>  reject(err));
    });
}

/**
 * Recommand users with the most amount of same hashtags
 * @param id_person Id of the person wanting recommandations
 * @returns users with the most amount of same hashtags
 */
function getPersonsWithSimilarHashtags(id_person:number) : Promise<ResponseObject<PersonName[]>> {
    return new Promise((resolve, reject) => {
        db.Similarities.findAll({
            attributes: [],
            where: {
                [Op.and]: {
                    [Op.or]: [
                        {id_person_1:id_person},
                        {id_person_2:id_person}
                    ],
                    [Op.and]: [
                        {index_similarities:{[Op.gt]:0}}
                    ]
                }
            },
            include: [
                {
                    model: db.Person,
                    as: 'person_1',
                    attributes: ['id_person','lastname_person','forename_person','username_person']
                },
                {
                    model: db.Person,
                    as: 'person_2',
                    attributes: ['id_person','lastname_person','forename_person','username_person']
                }
            ],
            limit: 5,
            order: [['index_similarities', 'DESC']]
        }).then((ress:any) => {
            const response:PersonName[] = [];
            ress.forEach((res:any) => {
                if (res.person_1.id_person!==id_person) response.push(res.person_1);
                else if (res.person_2.id_person!==id_person) response.push(res.person_2);
            });
            resolve({response:response, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Check if a person already exists
 * @param id_person 
 * @returns boolean
 */
function doesPersonExists(mail_person:string) : Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.Person.findOne({
            where: {mail_person: mail_person}
        }).then((res:Person) => {
            resolve(res!==null);
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Create a person
 * @param person Person to create
 * @returns ID of the newly created person
 */
function createPerson(person:{lastname_person:string, forename_person:string, gender_person:'M'|'F', birthdate_person:Date, username_person:string, mail_person:string, password_person:string, phone_person:string, confidentiality_person:'PUBLIC'|'PRIVATE', displayonline_person:boolean, bio_person?:string}) : Promise<ResponseObject<number|null>> {
    return new Promise((resolve, reject) => {
        if (!person.mail_person){
            resolve({response:null, err:'AUTHENTICATION'});
        }
        else{
            person.password_person = cryptoService.encryptSHA512(person.password_person);
            db.Person.findOne({
                where: {mail_person: person.mail_person}
            }).then((res:Person) => {
                if (res!==null) resolve({response:null,err:'MAIL_EXIST'});
                else db.Person.findOne({
                    where: {username_person: person.username_person}
                }).then((res:Person) => {
                    if (res!==null) resolve({response:null,err:'USERNAME_EXIST'});
                    else db.Person.create({       
                        lastname_person: person.lastname_person,
                        forename_person: person.forename_person,
                        gender_person: person.gender_person,
                        birthdate_person: person.birthdate_person,
                        username_person: person.username_person,
                        mail_person: person.mail_person,
                        password_person: person.password_person,
                        phone_person: person.phone_person,
                        confidentiality_person: person.confidentiality_person,
                        displayonline_person: person.displayonline_person,
                        bio_person: person.bio_person
                    }).then((res:Person) => {
                        similaritiesDAO.createOnPersonCreate(res.id_person);
                        resolve({response:res.id_person,err:'NO'});
                    }).catch((err:Error) => reject(err));
                });
            });
        }
    });
}

/**
 * Update a person
 * @param person Person to update
 */
function updatePerson(person:Person) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        if (!person.mail_person){
            resolve({response:null, err:'AUTHENTICATION'});
        }
        else{
            db.Person.findOne({
                where: {
                    mail_person: person.mail_person,
                    id_person: {[Op.ne]: person.id_person}
                }
            }).then((res:Person) => {
                if (res!==null) resolve({response:null,err:'MAIL_EXIST'});
                else db.Person.findOne({
                    where: {
                        username_person: person.username_person,
                        id_person: {[Op.ne]: person.id_person}
                    }
                }).then((res:Person) => {
                    if (res!==null) resolve({response:null,err:'USERNAME_EXIST'});
                    else db.Person.update(
                        {
                            lastname_person: person.lastname_person,
                            forename_person: person.forename_person,
                            gender_person: person.gender_person,
                            birthdate_person: person.birthdate_person,
                            username_person: person.username_person,
                            mail_person: person.mail_person,
                            phone_person: person.phone_person,
                            confidentiality_person: person.confidentiality_person,
                            displayonline_person: person.displayonline_person,
                            bio_person: person.bio_person
                        }, 
                        {
                            where: {id_person:person.id_person}
                        }
                    ).then(() => {
                        resolve({response:null, err:'NO'});
                    }).catch((err:Error) => reject(err));
                });
            });
        }
    });
}

/**
 * Update the password of a person
 * @param id_person ID of the person wanting to update its password
 * @param oldpassword_person Old password (must be correct)
 * @param newpassword_person New password
 */
function updatePassword(id_person:number, oldpassword_person:string, newpassword_person:string) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Person.findByPk(
            id_person
        ).then((person:Person) => {
            // Check if the old password is correct
            if (cryptoService.encryptSHA512(oldpassword_person)===person.password_person){
                // Encrypt the new password
                const newPasswordEncrypted = cryptoService.encryptSHA512(newpassword_person);
                db.Person.update(
                    {
                        password_person: newPasswordEncrypted
                    },
                    {
                        where: {id_person: id_person}
                    }
                ).then(() => {
                    resolve({response:null, err:'NO'});
                }).catch((err:Error) => reject(err));
            }
            else{
                resolve({response:null, err:'AUTHENTICATION'});
            }
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Delete a person
 * @param id_person ID of the person to delete
 */
function deletePerson(id_person:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Person.destroy({
            where: {id_person: id_person}
        }).then(() => {
            fs.unlink(`./uploads/profiles/${id_person}.png`, (err:any) => {
                if (err) console.log(err);
            });
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

export default { 
    getById,
    getAll,
    searchByName,
    getPersonsWithMostFollowers,
    getPersonsWithSimilarHashtags,
    doesPersonExists,
    createPerson,
    updatePerson,
    updatePassword,
    deletePerson
};