'use strict';

import { Model } from 'sequelize';

interface SimilaritiesModel {
    id_person_1:number;
    id_person_2:number;
    index_similarities:number;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Similarities extends Model<SimilaritiesModel> implements SimilaritiesModel {
        id_person_1!:number;
        id_person_2!:number;
        index_similarities!:number;
        static associate(models:any) {
            Similarities.belongsTo(models.Person, {foreignKey:'id_person_1', as:'person_1'});
            Similarities.belongsTo(models.Person, {foreignKey:'id_person_2', as: 'person_2'});
        }
    }
    
    Similarities.init({
        id_person_1: {
            primaryKey : true,
            allowNull : false,
            type: DataTypes.INTEGER
        },
        id_person_2: {
            primaryKey : true,
            allowNull : false,
            type: DataTypes.INTEGER
        },
        index_similarities: {
            allowNull : false,
            type: DataTypes.INTEGER
        }
    }, 
    {
        sequelize,
        modelName: 'Similarities',
        tableName: 't_similarities'
    });
    return Similarities;
};