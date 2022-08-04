'use strict';

import { Model } from 'sequelize';

interface LikepostModel {
  id_post:number;
  id_person:number;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Likepost extends Model<LikepostModel> implements LikepostModel {
        id_post!:number;
        id_person!:number;
        static associate(models:any) {
            Likepost.belongsTo(models.Person, {foreignKey:'id_person'});
            Likepost.belongsTo(models.Post, {foreignKey:'id_post'});
        }
    }

    Likepost.init({
        id_post: {
            primaryKey : true,
            allowNull : false,
            type: DataTypes.INTEGER
        },
        id_person: {
            primaryKey : true,
            allowNull : false,
            type: DataTypes.INTEGER
        }
    }, 
    {
        sequelize,
        modelName: 'Likepost',
        tableName: 't_likepost'
    });
    return Likepost;
};