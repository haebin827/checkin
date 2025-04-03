const dbConfig = require("../configs/dbConfig.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./User")(sequelize, Sequelize);
db.userChild = require("./UserChild")(sequelize, Sequelize);
db.child = require("./Child")(sequelize, Sequelize);
db.history = require("./History")(sequelize, Sequelize);
db.location = require("./Location")(sequelize, Sequelize);
db.childLocation = require("./ChildLocation")(sequelize, Sequelize);

// user - location (optional 1:optional 1)
db.user.belongsTo(db.location, {
    foreignKey: {
        name: "location_id",
        allowNull: true
    },
    as: "location"
});

db.location.hasOne(db.user, {
    foreignKey: {
        name: "location_id",
        allowNull: true
    },
    as: "user"
});

// child - user (M:N)
db.child.belongsToMany(db.user, {
    through: db.userChild,
    foreignKey: "child_id",
    otherKey: "user_id",
    as: "user",
});

db.user.belongsToMany(db.child, {
    through: db.userChild,
    foreignKey: "user_id",
    otherKey: "child_id",
    as: "child",
});

// child - history (1:optional N)
db.child.hasMany(db.history, {
    foreignKey: "child_id",
    as: "history",
    onDelete: "CASCADE",
});

db.history.belongsTo(db.child, {
    foreignKey: "child_id",
    as: "child",
    allowNull: false,
});

// child - location (M:N)
db.child.belongsToMany(db.location, {
    through: db.childLocation,
    foreignKey: "child_id",
    otherKey: "location_id",
    as: "location",
});

db.location.belongsToMany(db.child, {
    through: db.childLocation,
    foreignKey: "location_id",
    otherKey: "child_id",
    as: "child",
});

// location - history (1:optional N)
db.location.hasMany(db.history, {
    foreignKey: "location_id",
    as: "history",
    onDelete: "CASCADE",
});

db.history.belongsTo(db.location, {
    foreignKey: "location_id",
    as: "location",
    allowNull: false,
});

// user - history (1:optional N)
db.user.hasMany(db.history, {
    foreignKey: "checkin_by",
    as: "checkin_history",
});

db.history.belongsTo(db.user, {
    foreignKey: "checkin_by",
    as: "checkin_user",
    allowNull: false,
});

module.exports = db;