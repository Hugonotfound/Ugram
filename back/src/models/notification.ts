'use strict';

import { Model } from 'sequelize';

interface NotificationModel {
    id_notification:number;
    id_person_receiving:number;
    id_person_sending:number;
    type_notification:'LIKEPOST'|'COMMENT'|'LIKECOMMENT'|'FOLLOWER';
    isread_notification:boolean;
    id_post?:number;
    id_comment?:number;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Notification extends Model<NotificationModel> implements NotificationModel {
        id_notification!:number;
        id_person_receiving!:number;
        id_person_sending!:number;
        type_notification!:'LIKEPOST'|'COMMENT'|'LIKECOMMENT'|'FOLLOWER';
        isread_notification!:boolean;
        id_post?:number;
        id_comment?:number;
        static associate(models:any) {
            Notification.belongsTo(models.Person, {foreignKey:'id_person_receiving', as:'receiving'});
            Notification.belongsTo(models.Person, {foreignKey:'id_person_sending', as:'sending'});
            Notification.belongsTo(models.Post, {foreignKey:'id_post'});
            Notification.belongsTo(models.Comment, {foreignKey:'id_comment'});
        }
    }
    
    Notification.init({
        id_notification: {
            primaryKey : true,
            allowNull : false,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        id_person_receiving: {
            allowNull : false,
            type: DataTypes.INTEGER
        },
        id_person_sending: {
            allowNull : false,
            type: DataTypes.INTEGER
        },
        type_notification: {
            allowNull : false,
            type: DataTypes.STRING(12)
        },
        isread_notification: {
            allowNull : false,
            type: DataTypes.BOOLEAN
        },
        id_post: {
            allowNull : true,
            type: DataTypes.INTEGER
        },
        id_comment: {
            allowNull : true,
            type: DataTypes.INTEGER
        }
    }, 
    {
        sequelize,
        modelName: 'Notification',
        tableName: 't_notification'
    });
    return Notification;
};