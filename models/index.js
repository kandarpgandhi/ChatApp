const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false,
    }
);

const db = { Sequelize, sequelize };

db.User = require('./user')(sequelize, Sequelize);
db.ChatMessage = require('./chatMessage')(sequelize, Sequelize);

db.User.hasMany(db.ChatMessage, { foreignKey: 'userId' });
db.ChatMessage.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;
