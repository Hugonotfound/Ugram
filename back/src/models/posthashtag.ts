'use strict';

import { Model } from 'sequelize';

interface PosthashtagModel {
    id_post:number;
    id_hashtag:number;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Posthashtag extends Model<PosthashtagModel> implements PosthashtagModel {
        id_post!:number;
        id_hashtag!:number;
        static associate(models:any) {
            Posthashtag.belongsTo(models.Post, {foreignKey:'id_post'});
            Posthashtag.belongsTo(models.Hashtag, {foreignKey:'id_hashtag'});
        }
    }
  
    Posthashtag.init({
        id_post: {
            primaryKey : true,
            allowNull : false,
            type: DataTypes.INTEGER
        },
        id_hashtag: {
            primaryKey : true,
            allowNull : false,
            type: DataTypes.INTEGER
        }
    }, 
    {
        sequelize,
        modelName: 'Posthashtag',
        tableName: 't_posthashtag'
    });
    return Posthashtag;
};