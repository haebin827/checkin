module.exports = (sequelize, Sequelize) => {
  const Child = sequelize.define(
    'child',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      engName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 50],
          is: /^[a-zA-Z\s]+$/,
        },
      },
      korName: {
        type: Sequelize.STRING,
        validate: {
          len: [2, 20],
          is: /^[가-힣\s]+$/,
        },
      },
      birth: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
          isDate: true,
        },
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [10, 12],
          is: /^\d{10,12}$/,
        },
      },
      status: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '1',
        comment: '1: active, 0: deleted',
      },
      /*hospital_name: {
                type: Sequelize.STRING,
                validate: {
                    len: [2, 50],
                },
            },
            doctor_name: {
                type: Sequelize.STRING,
            },
            doctor_phone: {
                type: Sequelize.STRING,
            },
            emergency_note: {
                type: Sequelize.STRING,
                validate: {
                    len: [0, 500],
                },
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: 0,
            },*/
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'child',
      freezeTableName: true,
    },
  );

  return Child;
};
