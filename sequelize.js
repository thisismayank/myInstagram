const Sequelize = require('sequelize')
const UserModel = require('./models/users')
const FileModel = require('./models/file')
const userFileMappingModel = require('./models/user-file-mapping');



const sequelize = new Sequelize('users', 'postgres', 'postgres', {
    dialect: 'postgres',
    logging: false
});

const User = UserModel(sequelize, Sequelize)
const File = FileModel(sequelize, Sequelize)
const userFileMapping = userFileMappingModel(sequelize, Sequelize)

module.exports = {
  User,
  File,
  userFileMapping
}