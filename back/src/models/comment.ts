'use strict';

import { Model } from 'sequelize';

interface CommentModel {
  id_comment:number;
  id_post:number;
  id_person:number;
  text_comment: string;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Comment extends Model<CommentModel> implements CommentModel {
        id_comment!:number;
        id_post!:number;
        id_person!:number;
        text_comment!: string;
        static associate(models:any) {
            Comment.belongsTo(models.Person, {foreignKey:'id_person'});
            Comment.belongsTo(models.Post, {foreignKey:'id_post'});
            Comment.hasMany(models.Likecomment, {foreignKey:'id_comment'});
            Comment.hasMany(models.Notification, {foreignKey:'id_comment'});
        }
    }
  
    Comment.init({
        id_comment: {
            primaryKey : true,
            unique: true,
            allowNull : false,
            autoIncrement: true,
            defaultValue: 0,
            type: DataTypes.INTEGER
        },
        id_post: {
            allowNull : false,
            type: DataTypes.INTEGER
        },
        id_person: {
            allowNull : false,
            type: DataTypes.INTEGER
        },
        text_comment: {
            allowNull : false,
            type: DataTypes.STRING(500),
            validate: {not: '[^>]*>'}
        }
    }, 
    {
        sequelize,
        modelName: 'Comment',
        tableName: 't_comment'
    });
    return Comment;
};