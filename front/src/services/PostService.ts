import { toast } from 'react-toastify';
import axios from '../config/axios';

function getPosts() {
    return axios.get('/post/');
}

function getLastPosts() {
    return axios.get('/post/date/0');
}

function getByHashtag(id_hashtag:number) {
    return axios.get(`/post/hashtag/${id_hashtag}`);
}

function getRandomPosts() {
    return axios.get('/post/random/0');
}

function getPostLikesNbr(id_post: number) {
    return axios.get(`/likepost/count/${id_post}`);
}

function getPostImage(id_post: number) {
    return fetch(`${process.env.REACT_APP_API_URL}/post/post_image/${id_post}`);
}

function createPost(post: {id_person:number, caption_post:string, hashtags_post:string}, formData: FormData) {
    return axios.post('/post', post).then(res => {
        if (res.status >= 400) {
            toast.error('Could not create post');
        }
        else{
            toast.success('Post created');
            axios.post(`/post/post_image/${post.id_person}/${res.data.response}`, formData);
        }
    });
}

function updatePost(post: {id_post:number, id_person:number, caption_post:string, hashtags_post:string}) {
    return axios.put('/post', post);
}

function deletePost(id_person:number, id_post: number) {
    return axios.delete('/post', { data: { id_post:id_post, id_person: id_person } });
}

function getPost(id_post: number) {
    return axios.get(`/post/id/${id_post}`);
}

export default {
    getPosts,
    createPost,
    getLastPosts,
    getByHashtag,
    getRandomPosts,
    getPostLikesNbr,
    getPostImage,
    deletePost,
    updatePost,
    getPost
};
