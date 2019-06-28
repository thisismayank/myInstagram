'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('file', {
        fileName: {
            type: DataTypes.STRING,
            unique: true
        },
        description: DataTypes.STRING,
        numberOfLikes: DataTypes.INTEGER
    });

    // File.associate = function(models) {
    //     File.belongsToMany(models.Users, {
    //         through: 'user-file-mapping',
    //         foreignKey: 'fileId'
    //     });
    // };

    // return File;
}