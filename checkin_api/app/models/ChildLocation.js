module.exports = (sequelize, Sequelize) => {

    const ChildLocation = sequelize.define("child_location",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            child_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "child",
                    key: "id",
                },
            },
            location_id: {
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
        }
    );

    return ChildLocation;
};