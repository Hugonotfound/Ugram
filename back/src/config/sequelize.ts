'use strict';

import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./config')[env];
const db:any = {};

console.log(process.env.NODE_ENV);

let sequelize:any;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} 
else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Models
const models = [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/comment')(sequelize, Sequelize.DataTypes),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/follow')(sequelize, Sequelize.DataTypes),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/similarities')(sequelize, Sequelize.DataTypes),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/likecomment')(sequelize, Sequelize.DataTypes),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/likepost')(sequelize, Sequelize.DataTypes),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/person')(sequelize, Sequelize.DataTypes),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/post')(sequelize, Sequelize.DataTypes),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/hashtag')(sequelize, Sequelize.DataTypes),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/posthashtag')(sequelize, Sequelize.DataTypes),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/tag')(sequelize, Sequelize.DataTypes),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../models/notification')(sequelize, Sequelize.DataTypes)
];
models.forEach((model) => {
    db[model.name] = model;
});

// Associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

if (env==='development'){
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sequelizeErd = require('sequelize-erd');
    // Generating dev erd
    sequelizeErd({ source: sequelize }).then((svg:any) => {
        fs.writeFileSync(path.join(__dirname+'/../../database/', 'erd.svg'), svg);
    });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
