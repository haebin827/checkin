module.exports = (sequelize, Sequelize) => {
  const History = sequelize.define(
    'history',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
      },
      /*
      childId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
      checkoutDatetime: {
                type: Sequelize.DATE,
            },*/
      /*checkinBy: {
                type: Sequelize.INTEGER,
                allowNull: false
            },*/
      /*checkoutBy: {
                type: Sequelize.INTEGER,
            },*/
      /*locationId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },*/
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'history',
      freezeTableName: true,
    },
  );

  return History;
};
