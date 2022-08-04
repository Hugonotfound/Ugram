'use strict';

import { Model } from 'sequelize';

interface FollowModel {
    id_person_following:number;
    id_person_followed:number;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Follow extends Model<FollowModel> implements FollowModel {
        id_person_following!:number;
        id_person_followed!:number;
        static associate(models:any) {
            Follow.belongsTo(models.Person, {foreignKey:'id_person_following', as:'following'});
            Follow.belongsTo(models.Person, {foreignKey:'id_person_followed', as: 'followed'});
        }
    }
  
    Follow.init({
        id_person_following: {
            primaryKey : true,
            allowNull : false,
            type: DataTypes.INTEGER
        },
        id_person_followed: {
            primaryKey : true,
            allowNull : false,
            type: DataTypes.INTEGER
        }
    }, 
    {
        sequelize,
        modelName: 'Follow',
        tableName: 't_follow'
    });
    return Follow;
};