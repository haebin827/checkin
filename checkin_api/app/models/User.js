module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        /*validate: {
                    len: [5, 20],
                    isAlphanumeric: true,
                },*/
      },
      password: {
        type: Sequelize.STRING,
        //allowNull: false,
        /*validate: {
                    len: [8, 30],
                },*/
      },
      engName: {
        type: Sequelize.STRING,
        defaultValue: null,
        //allowNull: false,
        /*validate: {
                    notEmpty: true,
                    len: [2, 50],
                    is: /^[a-zA-Z\s]+$/,
                },*/
      },
      korName: {
        type: Sequelize.STRING,
        defaultValue: null,
        /*validate: {
                    len: [2, 20],
                    is: /^[가-힣\s]+$/,
                },*/
      },
      phone: {
        type: Sequelize.STRING,
        defaultValue: null,
        unique: true,
        validate: {
          //notEmpty: true,
          len: [10, 12],
          is: /^\d{10,12}$/,
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: Sequelize.ENUM('guardian', 'admin', 'manager'),
        defaultValue: 'guardian',
        allowNull: false,
      },
      googleId: {
        type: Sequelize.STRING,
        unique: true,
      },
      kakaoId: {
        type: Sequelize.STRING,
        unique: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'user',
      freezeTableName: true,
    },
  );

  return User;
};
