'use strict';

import { Model } from 'sequelize';

interface HashtagModel {
    id_hashtag:number;
    name_hashtag:string;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Hashtag extends Model<HashtagModel> implements HashtagModel {
        id_hashtag!:number;
        name_hashtag!:string;
        static associate(models:any) {
            Hashtag.hasMany(models.Posthashtag, {foreignKey:'id_hashtag'});
        }
    }

    Hashtag.init({
        id_hashtag: {
            primaryKey : true,
            allowNull : true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        name_hashtag: {
            allowNull : false,
            type: DataTypes.STRING(50)
        }
    }, 
    {
        sequelize,
        modelName: 'Hashtag',
        tableName: 't_hashtag'
    });
    return Hashtag;
};