export interface Person {
    id_person:number;
    lastname_person: string;
    forename_person: string;
    gender_person: 'M'|'F';
    birthdate_person: Date;
    username_person: string;
    mail_person: string;
    password_person: string;
    phone_person: string;
    confidentiality_person: 'PUBLIC'|'PRIVATE';
    displayonline_person: boolean;
    bio_person?: string;
    created_at?:Date;
    updated_at?:Date;
}
export interface PersonWithFollow {
    id_person:number;
    lastname_person: string;
    forename_person: string;
    gender_person: 'M'|'F';
    birthdate_person: Date;
    username_person: string;
    mail_person: string;
    password_person?: string;
    phone_person: string;
    confidentiality_person: 'PUBLIC'|'PRIVATE';
    displayonline_person: boolean;
    followersnumber_person: number;
    followingnumber_person: number;
    bio_person?: string;
    created_at?:Date;
    updated_at?:Date;
}

export interface PersonName {
    id_person:number;
    lastname_person: string;
    forename_person: string;
    username_person: string;
}