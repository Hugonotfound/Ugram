import axios from '../config/axios';

function isSubscribedTo(id_person:number, id_person_tocheck:number) {
    return axios.get(`/follow/subscriptions/check/${id_person}/${id_person_tocheck}`);
}

function createSubscription(id_person:number, id_person_followed:number) {
    return axios.post('/follow/subscriptions', {id_person:id_person, id_person_followed:id_person_followed});
}

function deleteSubscription(id_person:number, id_person_followed:number) {
    return axios.delete('/follow/subscriptions', {data:{id_person:id_person, id_person_followed:id_person_followed}});
}

export default {
    isSubscribedTo,
    createSubscription,
    deleteSubscription
};