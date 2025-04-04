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
            qrSecret: {
                type: Sequelize.STRING
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