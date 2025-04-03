module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user",
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
                validate: {
                    len: [5, 20],
                    isAlphanumeric: true,
                },
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    len: [8, 30],
                },
            },
            eng_name: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 50],
                    is: /^[a-zA-Z\s]+$/,
                },
            },
            kor_name: {
                type: Sequelize.STRING,
                validate: {
                    len: [2, 20],
                    is: /^[가-힣\s]+$/,
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
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            locationId: {
                type: Sequelize.INTEGER,
            },
            role: {
                type: Sequelize.ENUM('guardian', 'admin', 'manager'),
                defaultValue: 'guardian',
                allowNull: false
            }
        },
        {
            timestamps: true,
        }
    );

    return User;
};