module.exports = (sequelize, Sequelize) => {
    const History = sequelize.define("history",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            childId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            /*status: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
            },*/
            checkinDatetime: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            /*checkoutDatetime: {
                type: Sequelize.DATE,
            },*/
            checkinBy: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            /*checkoutBy: {
                type: Sequelize.INTEGER,
            },*/
            locationId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'history',
            freezeTableName: true
        }
    );

    return History;
};