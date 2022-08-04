'use strict';

import { Model } from 'sequelize';

interface PostModel {
    id_post:number;
    id_person:number;
    // hashtags_post?: string;
    caption_post?: string;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Post extends Model<PostModel> implements PostModel {
        id_post!:number;
        id_person!:number;
        picture_post!:string;
        // hashtags_post?: string;
        caption_post?: string;
        static associate(models:any) {
            Post.belongsTo(models.Person, {foreignKey:'id_person'});
            Post.hasMany(models.Comment, {foreignKey:'id_post'});
            Post.hasMany(models.Likepost, {foreignKey:'id_post'});
            Post.hasMany(models.Tag, {foreignKey:'id_post'});
            Post.hasMany(models.Posthashtag, {foreignKey:'id_post'});
            Post.hasMany(models.Notification, {foreignKey:'id_post'});
        }
    }
    
    Post.init({
        id_post: {
            primaryKey : true,
            unique: true,
            allowNull : false,
            autoIncrement: true,
            defaultValue: 0,
            type: DataTypes.INTEGER
        },
        id_person: {
            allowNull : false,
            type: DataTypes.INTEGER
        },
        // hashtags_post: {
        //     allowNull : true,
        //     type: DataTypes.STRING(255),
        //     validate: {is: "^(#+[a-zA-Z0-9(_)]{1,}[ ]?)+$"}
        // },
        caption_post: {
            allowNull : true,
            type: DataTypes.STRING(1000),
            validate: {not: '<[^>]*>'}
        }
    }, 
    {
        sequelize,
        modelName: 'Post',
        tableName: 't_post'
    });
    return Post;
};