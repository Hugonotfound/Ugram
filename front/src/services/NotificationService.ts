import axios from '../config/axios';

function countByPersonReceiving(id_person:number) {
    return axios.get(`/notification/count/${id_person}`);
}


function getByPersonReceiving(id_person:number) {
    return axios.get(`/notification/id/${id_person}`);
}

function readNotification(id_notification:number, id_person:number){
    return axios.put('/notification', {id_notification:id_notification, id_person:id_person});
}

export default {
    countByPersonReceiving,
    getByPersonReceiving,
    readNotification
};