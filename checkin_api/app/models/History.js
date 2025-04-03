module.exports = (sequelize, Sequelize) => {

    const History = sequelize.define("history",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            child_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            /*status: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
            },*/
            checkin_datetime: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            /*checkout_datetime: {
                type: Sequelize.DATE,
            },*/
            checkin_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            /*checkout_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },*/
            is_qr_used: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            location_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            timestamps: true,
        }
    );

    return History;
};