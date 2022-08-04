import db from '../config/sequelize';

import { ResponseObject } from '../types/request';
import { Person, PersonName } from '../types/person';

import cryptoService from '../services/cryptoService';

/**
 * Check if the sent mail and password correspond to what is in the database
 * @param loginObject - mail_person, password_person
 * @returns ID, lastname and forename of the authenticated person
 */
function login(loginObject:{mail_person:string, password_person:string}) : Promise<ResponseObject<PersonName|null>> {
    return new Promise((resolve, reject) => {
        db.Person.findOne({
            where: {mail_person:loginObject.mail_person}
        }).then((person:Person) => {
            if (person===null || (cryptoService.encryptSHA512(loginObject.password_person) !== person.password_person)) {
                resolve({response:null, err:'AUTHENTICATION'});
            }
            else {
                resolve({response:{id_person:person.id_person,lastname_person:person.lastname_person,forename_person:person.forename_person,username_person:person.username_person}, err:'NO'});
            }
        }).catch((err:Error) => reject(err));
    });
}

export default { 
    login
};