'use strict';

import { Model } from 'sequelize';

interface LikecommentModel {
  id_comment:number;
  id_person:number;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Likecomment extends Model<LikecommentModel> implements LikecommentModel {
        id_comment!:number;
        id_person!:number;
        static associate(models:any) {
            Likecomment.belongsTo(models.Person, {foreignKey:'id_person'});
            Likecomment.belongsTo(models.Comment, {foreignKey:'id_comment'});
        }
    }

    Likecomment.init({
        id_comment: {
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
        modelName: 'Likecomment',
        tableName: 't_likecomment'
    });
    return Likecomment;
};