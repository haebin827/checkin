const Sequelize = require("sequelize");

module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,

    pool: {
        max: parseInt(process.env.DB_POOL_MAX, 10),
        min: parseInt(process.env.DB_POOL_MIN, 10),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10),
        idle: parseInt(process.env.DB_POOL_IDLE, 10)
    },
    define: {
        underscored: true
    }
});