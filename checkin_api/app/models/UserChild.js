module.exports = (sequelize, Sequelize) => {

    const UserChild = sequelize.define("user_child",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "id",
                },
            },
            child_id: {
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
        }
    );

    return UserChild;
};