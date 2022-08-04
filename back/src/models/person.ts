'use strict';

import { Model } from 'sequelize';

interface PersonModel {
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
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Person extends Model<PersonModel> implements PersonModel {
        id_person!:number;
        lastname_person!: string;
        forename_person!: string;
        gender_person!: 'M'|'F';
        birthdate_person!: Date;
        username_person!: string;
        mail_person!: string;
        password_person!: string;
        phone_person!: string;
        confidentiality_person!: 'PUBLIC'|'PRIVATE';
        displayonline_person!: boolean;
        bio_person?: string;
        static associate(models:any) {
            Person.hasMany(models.Post, {foreignKey:'id_person'});
            Person.hasMany(models.Likepost, {foreignKey:'id_person'});
            Person.hasMany(models.Comment, {foreignKey:'id_person'});
            Person.hasMany(models.Likecomment, {foreignKey:'id_person'});
            Person.hasMany(models.Follow, {foreignKey:'id_person_following'});
            Person.hasMany(models.Follow, {foreignKey:'id_person_followed'});
            Person.hasMany(models.Tag, {foreignKey:'id_person'});
            Person.hasMany(models.Similarities, {foreignKey:'id_person_1'});
            Person.hasMany(models.Similarities, {foreignKey:'id_person_2'});
            Person.hasMany(models.Notification, {foreignKey:'id_person_receiving'});
            Person.hasMany(models.Notification, {foreignKey:'id_person_sending'});
        }
    }

    Person.init({
        id_person: {
            primaryKey : true,
            unique: true,
            allowNull : false,
            autoIncrement: true,
            defaultValue: 0,
            type: DataTypes.INTEGER
        },
        lastname_person: {
            allowNull : false,
            type: DataTypes.STRING(35),
            validate: {not: '<[^>]*>'}
        },
        forename_person: {
            allowNull : false,
            type: DataTypes.STRING(35),
            validate: {not: '<[^>]*>'}
        },
        gender_person: {
            allowNull : false,
            type: DataTypes.STRING(1)
        },
        birthdate_person: {
            allowNull : false,
            type: DataTypes.DATEONLY
        },
        username_person: {
            allowNull : false,
            type: DataTypes.STRING(35),
            unique: true,
            validate: {not: '<[^>]*>'}
        },
        mail_person: {
            allowNull : false,
            type: DataTypes.STRING(50),
            unique: true,
            validate: {isEmail: true, not: '<[^>]*>'}
        },
        password_person: {
            allowNull : false,
            type: DataTypes.STRING(128),
            validate: {len: [128,128]}
        },
        phone_person: {
            allowNull : false,
            type: DataTypes.STRING(15),
            validate: {is: '^[+]?[0-9]{0,14}$', not: '<[^>]*>'}
        },
        confidentiality_person: {
            allowNull : false,
            defaultValue : true,
            type: DataTypes.STRING(10),
            validate: {not: '<[^>]*>'}
        },
        displayonline_person: {
            allowNull : false,
            defaultValue : true,
            type: DataTypes.BOOLEAN
        },
        bio_person: {
            allowNull : true,
            defaultValue : null,
            type: DataTypes.STRING(1000)
        }
    }, 
    {
        sequelize,
        modelName: 'Person',
        tableName: 't_person'
    });
    return Person;
};