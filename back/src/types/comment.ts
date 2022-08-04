export interface Comment {
    id_comment:number;
    id_post:number;
    person: {id_person:number; forename_person:string; lastname_person:string; username_person:string};
    isliked_comment?: boolean;
    likes_comment?: number;
    text_comment: string;
    created_at?:Date;
    updated_at?:Date;
}