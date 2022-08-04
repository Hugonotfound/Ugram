'use strict';

import { Model } from 'sequelize';

interface TagModel {
    id_post:number;
    id_person:number;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Tag extends Model<TagModel> implements TagModel {
        id_post!:number;
        id_person!:number;
        static associate(models:any) {
            Tag.belongsTo(models.Person, {foreignKey:'id_person'});
            Tag.belongsTo(models.Post, {foreignKey:'id_post'});
        }
    }
    
    Tag.init({
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
        modelName: 'Tag',
        tableName: 't_tag'
    });
    return Tag;
};