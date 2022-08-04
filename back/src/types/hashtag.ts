export interface Hashtag {
    id_hashtag:number;
    name_hashtag:string;
}
export interface PersonHashtags {
    id_person:number;
    forename_person:string;
    lastname_person:string;
    username_person:string;
    hashtags:{id_hashtag:number, name_hashtag:string, occurrences_hashtag:number}[]
}