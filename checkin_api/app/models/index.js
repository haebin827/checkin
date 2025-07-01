const sequelize = require('../configs/dbConfig');
const Sequelize = require('sequelize');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./User')(sequelize, Sequelize);
db.userChild = require('./UserChild')(sequelize, Sequelize);
db.child = require('./Child')(sequelize, Sequelize);
db.history = require('./History')(sequelize, Sequelize);
db.location = require('./Location')(sequelize, Sequelize);

// User - Location (optional 1:optional many)
db.user.belongsTo(db.location, {
  foreignKey: {
    name: 'location_id',
    field: 'locationId',
    allowNull: true,
  },
  as: 'location',
});

db.location.hasMany(db.user, {
  foreignKey: {
    name: 'location_id',
    field: 'locationId',
    allowNull: true,
  },
  as: 'user',
});

// Child - User (M:N)
db.child.belongsToMany(db.user, {
  through: db.userChild,
  foreignKey: {
    name: 'child_id',
    field: 'childId',
  },
  otherKey: {
    name: 'user_id',
    field: 'userId',
  },
  as: 'users',
});

db.user.belongsToMany(db.child, {
  through: db.userChild,
  foreignKey: {
    name: 'user_id',
    field: 'userId',
  },
  otherKey: {
    name: 'child_id',
    field: 'childId',
  },
  as: 'children',
});

// UserChild - Location (M:1)
db.userChild.belongsTo(db.location, {
  foreignKey: {
    name: 'location_id',
    field: 'locationId',
    allowNull: false,
  },
  as: 'location',
});

db.location.hasMany(db.userChild, {
  foreignKey: {
    name: 'location_id',
    field: 'locationId',
    allowNull: false,
  },
  as: 'userChildren',
});

// Child - HistoryPage (1:optional N)
db.child.hasMany(db.history, {
  foreignKey: {
    name: 'child_id',
    field: 'childId',
  },
  as: 'histories',
  onDelete: 'CASCADE',
});

db.history.belongsTo(db.child, {
  foreignKey: {
    name: 'child_id',
    field: 'childId',
    allowNull: false,
  },
  as: 'child',
});

// Location - HistoryPage (1:optional N)
db.location.hasMany(db.history, {
  foreignKey: {
    name: 'location_id',
    field: 'locationId',
  },
  as: 'histories',
  onDelete: 'CASCADE',
});

db.history.belongsTo(db.location, {
  foreignKey: {
    name: 'location_id',
    field: 'locationId',
    allowNull: false,
  },
  as: 'location',
});

// User - HistoryPage (1:optional N)
db.user.hasMany(db.history, {
  foreignKey: {
    name: 'checkin_by',
    field: 'checkinBy',
  },
  as: 'checkinHistories',
});

db.history.belongsTo(db.user, {
  foreignKey: {
    name: 'checkin_by',
    field: 'checkinBy',
    allowNull: false,
  },
  as: 'checkinUser',
});

db.user.hasMany(db.history, {
  foreignKey: {
    name: 'checkout_by',
    field: 'checkoutBy',
  },
  as: 'checkoutHistories',
});

db.history.belongsTo(db.user, {
  foreignKey: {
    name: 'checkout_by',
    field: 'checkoutBy',
    allowNull: true,
  },
  as: 'checkoutUser',
});

// Child - Location (1:N)
db.child.belongsTo(db.location, {
  foreignKey: {
    name: 'location_id',
    field: 'locationId',
    allowNull: false,
  },
  as: 'location',
});

db.location.hasMany(db.child, {
  foreignKey: {
    name: 'location_id',
    field: 'locationId',
    allowNull: false,
  },
  as: 'children',
});

// History Associations
db.history.belongsTo(db.child, {
  foreignKey: 'child_id',
  targetKey: 'id',
});

db.history.belongsTo(db.location, {
  foreignKey: 'location_id',
  targetKey: 'id',
});

db.history.belongsTo(db.user, {
  foreignKey: 'checkin_by',
  targetKey: 'id',
  as: 'checkedInBy',
});

module.exports = db;
