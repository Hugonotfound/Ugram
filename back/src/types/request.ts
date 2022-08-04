export interface ResponseObject<T> {
    response:T;
    err:'NO'|'AUTHENTICATION'|'MAIL_EXIST'|'USERNAME_EXIST'|'OTHER';
}