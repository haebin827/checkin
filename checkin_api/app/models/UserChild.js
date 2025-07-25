module.exports = (sequelize, Sequelize) => {
  const UserChild = sequelize.define(
    'user_child',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      /*userId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            childId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },*/
      relationship: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Guardian (Please set the relationship)',
        validate: {
          notEmpty: true,
        },
      },
      isSms: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '1',
        comment: '1: yes, 0: no',
      },
      status: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '1',
        comment: '1: active, 0: deleted',
      },
      /*locationId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },*/
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'user_child',
      freezeTableName: true,
    },
  );

  return UserChild;
};
