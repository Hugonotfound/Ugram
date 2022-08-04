import db from '../config/sequelize';
import { Op } from 'sequelize';
import { ResponseObject } from '../types/request';
import hashtagDAO from './hashtagDAO';
import { PersonHashtags } from '../types/hashtag';

/**
 * Create entries in the similarities table, to call when a new person is created
 * @param id_person
 */
function createOnPersonCreate(id_person:number) : Promise<ResponseObject<null>> {
    return new Promise((resolve, reject) => {
        db.Person.findAll({
            attributes:['id_person'],
            where: {id_person: {[Op.ne]: id_person}}
        }).then((otherPersons:{id_person:number}[]) => {
            otherPersons.forEach((otherPerson:{id_person:number}) => {
                db.Similarities.create({
                    id_person_1: otherPerson.id_person,
                    id_person_2: id_person,
                    index_similarities:0
                }).then(() => {
                    resolve({response:null, err:'NO'});
                }).catch((err:Error) => reject(err));
            });
            resolve({response:null, err:'NO'});
        }).catch((err:Error) => reject(err));
    });
}

/**
 * Update similarities index on post creation or update
 * @param id_post
 */
function updateOnPost(post:{id_post:number, id_person:number, hashtags:number[]}) : void {
    hashtagDAO.getPersonsHashtags().then((personsHashtags:PersonHashtags[]) => {
        // Compare each person with the one that made the post
        personsHashtags.forEach((personHashtags:PersonHashtags) => {
            if (post.id_person!==personHashtags.id_person){
                // Number of common hashtags with that post for this other person
                let similaritiesNumber = 0;
                // Iterate through hashtags of the post and hashtags of other persons to find common hashtags
                personHashtags.hashtags.forEach((h1:{id_hashtag:number, name_hashtag:string, occurrences_hashtag:number}) => {
                    post.hashtags.forEach((h2:number) => {
                        // Similarity found
                        if (h1.id_hashtag===h2){
                            similaritiesNumber+=h1.occurrences_hashtag;
                        }
                    });
                });
                // Increment similarities with the number of similarities in this post
                const lowIndex = (post.id_person<personHashtags.id_person) ? post.id_person : personHashtags.id_person;
                const highIndex = (post.id_person>personHashtags.id_person) ? post.id_person : personHashtags.id_person;
                db.Similarities.update(
                    {index_similarities: db.Sequelize.literal(`index_similarities + ${similaritiesNumber}`)},
                    {where: {id_person_1:lowIndex, id_person_2:highIndex}}
                );
            }
        });
    });
}

export default { 
    createOnPersonCreate,
    updateOnPost
};