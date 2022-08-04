import axios from '../config/axios';

function createLikepost(id_person:number, id_post:number) {
    return axios.post('/likepost', {id_person:id_person, id_post:id_post});
}

function deleteLikepost(id_person:number, id_post:number) {
    return axios.delete('/likepost', {data:{id_person:id_person, id_post:id_post}});
}

export default {
    createLikepost,
    deleteLikepost
};