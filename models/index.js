// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('users', 'postgres', 'postgres', {
//     dialect: 'postgres'
// });

// const models = {
//     Users: sequelize.import('./users'),
//     File: sequelize.import('./file'),
//     // UserFileMapping: sequelize.import('./user-file-mapping'),

// };

// Object.keys(models).forEach((modelName)=>{
//     if('associate' in models[modelName]) {
//         models[modelName].associate(models);
//     }
// });
// models.Sequelize = Sequelize;
// models.sequelize = sequelize;

// module.exports = models;