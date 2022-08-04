import axios from '../config/axios';

function createLikecomment(id_person:number, id_comment:number) {
    return axios.post('/likecomment', {id_person:id_person, id_comment:id_comment});
}

function deleteLikecomment(id_person:number, id_comment:number) {
    return axios.delete('/likecomment', {data:{id_person:id_person, id_comment:id_comment}});
}

export default {
    createLikecomment,
    deleteLikecomment
};