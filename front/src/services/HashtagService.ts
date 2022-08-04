import axios from '../config/axios';

function getMostUsedHashtags() {
    return axios.get('/hashtag/mostused');
}

function searchHashtags(search_text:string) {
    return axios.get(`/hashtag/search/${search_text}`);
}

export default {
    getMostUsedHashtags,
    searchHashtags
};
