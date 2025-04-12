module.exports = (sequelize, Sequelize) => {
    const ChildLocation = sequelize.define("child_location",
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
            locationId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'child_location',
            freezeTableName: true
        }
    );

    return ChildLocation;
};