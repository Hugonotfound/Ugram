export interface Notification {
    id_notification:number;
    id_person_receiving:number;
    person_sending: {id_person:number;forename_person:string;lastname_person:string;username_person:string;}
    type_notification:'LIKEPOST'|'COMMENT'|'LIKECOMMENT'|'FOLLOWER';
    isread_notification:boolean;
    post?:{id_post:number;caption_post?:string}
    id_comment?:number;
    created_at:Date;
}