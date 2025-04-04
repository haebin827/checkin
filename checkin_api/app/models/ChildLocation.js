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
                allowNull: false,
                references: {
                    model: "child",
                    key: "id",
                },
            },
            locationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "location",
                    key: "id",
                },
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