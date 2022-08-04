import express from 'express';
import passport from 'passport';
import googleOAuth from 'passport-google-oauth2';
import constants from '../constants/constants';
import loginDAO from '../dao/loginDAO';
import personDAO from '../dao/personDAO';

import { ResponseObject } from '../types/request';
import { PersonName } from '../types/person';

const router = express.Router({ mergeParams: true });
const GoogleStrategy = googleOAuth.Strategy;
let userProfile: any;

router.use(passport.initialize());
router.use(passport.session());
passport.serializeUser(function(user, cb) {
    cb(null, user);
});
passport.deserializeUser(function(obj : any, cb) {
    return cb(null, obj);
});

/**
 * Config
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: `${process.env.API_URL}/auth/google/callback`
},
(accessToken: any, refreshToken: any, profile: any, done: (arg0: null, arg1: any) => any) => {
    userProfile=profile;
    return done(null, userProfile);
}
));
 
/**
 * Auth
 */
router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), (req: express.Request, res: express.Response) => {
    // If auth has succeeded
    if (userProfile.email_verified && userProfile.verified){
        // Create by default password
        const password:string = process.env.SALT_BEFORE+userProfile.id+process.env.SALT_AFTER+userProfile.email;
        // Check if already existing in database
        personDAO.doesPersonExists(userProfile.email).then((exists:boolean) => {
            if (!exists){
                // Create new entry, then login
                personDAO.createPerson({
                    lastname_person: userProfile.family_name,
                    forename_person: userProfile.given_name,
                    gender_person: 'M',
                    birthdate_person: new Date('1970-01-01'),
                    username_person: `${userProfile.family_name}${userProfile.given_name}`,
                    mail_person: userProfile.email,
                    password_person: password,
                    phone_person: '0000000000',
                    confidentiality_person: 'PRIVATE',
                    displayonline_person: false,
                    bio_person: ''
                }).then((response:ResponseObject<number|null>) => {
                    if (response.err==='NO' && response.response!==null){
                        req.session.id_person = response.response;
                        res.redirect(`${process.env.WEB_URL}/auth/${response.response}/${userProfile.family_name}/${userProfile.given_name}/${userProfile.family_name}${userProfile.given_name}`);
                    }
                    else{
                        res.redirect(`${process.env.WEB_URL}`);
                    }
                }).catch((err) => {
                    console.log(err);
                    res.status(constants.ERROR_CODE.SERVER).end();
                });
            }
            // Login
            else{
                loginDAO.login({
                    mail_person:userProfile.email, 
                    password_person:password
                }).then((response:ResponseObject<PersonName|null>) => {
                    // Set session data
                    if (response.err==='NO' && response.response!==null){
                        req.session.id_person = response.response.id_person;
                        res.redirect(`${process.env.WEB_URL}/auth/${response.response.id_person}/${response.response.lastname_person}/${response.response.forename_person}/${response.response.username_person}`);
                    }
                    else{
                        res.redirect(`${process.env.WEB_URL}`);
                    }
                    // Response
                    //res.status(constants.SUCCESS_CODE.OK).json(response).end();
                }).catch((err) => {
                    console.log(err);
                    res.status(constants.ERROR_CODE.SERVER).end();
                });
            }
        });
    }
});

router.get('/error', (req, res) => res.send('error logging in'));

module.exports = router;
