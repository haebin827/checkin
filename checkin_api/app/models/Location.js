module.exports = (sequelize, Sequelize) => {

    const Location = sequelize.define("location",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                    len: [2, 50],
                },
            },
            address: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING,
                defaultValue: null,
                validate: {
                    //notEmpty: true,
                    len: [10, 12],
                    is: /^\d{10,12}$/,
                },
            },
            uuid: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.ENUM('0', '1'),
                defaultValue: '1',
                comment: '1: active, 0: deleted'
            }
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'location',
            freezeTableName: true
        }
    );

    return Location;
};