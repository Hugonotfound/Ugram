export interface IPost {
    id_post: number;
    person: {id_person:number; forename_person:string; lastname_person:string; username_person:string};
    isliked_post?: boolean;
    likes_post: number;
    comments_post: number;
    hashtags_post: string;
    caption_post: string;
    created_at: Date;
    updated_at: Date;
}
export interface Hashtag {
    id_hashtag:number;
    name_hashtag:string;
}
