import axios from '../config/axios';

function getByPost(id_post:number) {
    return axios.get(`/comment/post/get/${id_post}`);
}

function createComment(id_post:number, id_person:number, text_comment:string) {
    return axios.post('/comment',{id_post:id_post, id_person:id_person, text_comment:text_comment});
}

function deleteComment(id_comment:number, id_person:number) {
    return axios.delete('/comment', { data: { id_comment:id_comment, id_person:id_person } });
}

export default {
    getByPost,
    createComment,
    deleteComment
};