import axios from '../config/axios';
import { User } from '../types/User';

function searchUser(searchQuery: string) {
    return axios.get(`/person/search/${searchQuery}/0`);
}

function getUserPosts(userID: number) {
    return axios.get(`/post/person/${userID}/0`);
}

function getProfileImage(userID: number) {
    return fetch(`${process.env.REACT_APP_API_URL}/person/profile_picture/${userID}`);
}

function getUser(id: number) {
    return axios.get(`/person/id/${id}`);
}

function getAllUsers() {
    return axios.get('/person/all/0');
}

function getMostFollowersRecommandations() {
    return axios.get('/person/followers');
}

function getSimilaritiesRecommandations(id_person:number) {
    return axios.get(`/person/hashtag/${id_person}`);
}

function postProfilePicture(id_person:number, formData:FormData) {
    return axios.post(`/person/profile_picture/${id_person}`, formData);
}

export function createUser(user: User) {
    return axios.post('/person', user);
}

function updateUser(userID: number, firstname: string, lastname: string, email: string, phone: string, username: string) {
    return axios.put('/person', {id_person: userID, forename_person: firstname, lastname_person: lastname, mail_person: email, phone_person: phone, username_person: username});
}

export default {
    createUser,
    searchUser,
    getUserPosts,
    getProfileImage,
    getUser,
    getAllUsers,
    getMostFollowersRecommandations,
    getSimilaritiesRecommandations,
    postProfilePicture,
    updateUser
};
