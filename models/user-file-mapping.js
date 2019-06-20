'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('userFileMapping', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: DataTypes.INTEGER,
        fileId: DataTypes.INTEGER,
        isActive: DataTypes.BOOLEAN,
    });

    // User.associate = function(models) {
    //     User.belongsToMany(models.File, {
    //         through: 'user-file-mapping',
    //         foreignKey: 'userId'
    //     });
    // };

    // return User;
}

// module.exports =  user;