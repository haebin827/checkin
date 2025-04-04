module.exports = (sequelize, Sequelize) => {
    const UserChild = sequelize.define("user_child",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "id",
                },
            },
            childId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "child",
                    key: "id",
                },
            },
            relationship: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [1, 20],
                },
            },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'user_child',
            freezeTableName: true
        }
    );

    return UserChild;
};