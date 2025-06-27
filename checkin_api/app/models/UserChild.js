module.exports = (sequelize, Sequelize) => {
    const UserChild = sequelize.define("user_child",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            /*userId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            childId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },*/
            relationship: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [1, 20],
                },
            },
            /*locationId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },*/
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