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
            type: Sequelize.ENUM('-1', '0', '1'),
            defaultValue: '1',
            comment: '1: checked-in, 0: checked-out, -1: hidden',
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
