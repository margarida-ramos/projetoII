const dbConfig = require('../config/db.config.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    dialect: dbConfig.dialect
    ,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};
db.sequelize = sequelize;

//export all models
db.activity = require("./activities.model.js")(sequelize, DataTypes);
db.user = require("./users.model.js")(sequelize, DataTypes);
db.course = require("./courses.model.js")(sequelize, DataTypes);
db.usertype = require("./usertypes.model.js")(sequelize, DataTypes);
db.class = require("./classes.model.js")(sequelize, DataTypes);
db.submission = require("./submissions.model.js")(sequelize, DataTypes);
db.question = require("./questions.model.js")(sequelize, DataTypes);
db.answer = require("./answers.model.js")(sequelize, DataTypes);

//define 1:N relationships
/* db.course.hasMany(db.activity);
db.activity.belongsTo(db.course);

db.class.hasMany(db.activity);
db.activity.belongsTo(db.class);

db.activity.hasMany(db.question);
db.question.belongsTo(db.activity);

db.submission.hasMany(db.question);
db.question.belongsTo(db.submission);

db.user.hasMany(db.submission);
db.submission.belongsTo(db.user);

 */



/* 



db.submission.hasMany(db.user, {
    foreignKey: 'idUser'
});
db.user.belongsTo(db.submission); */
db.activity.hasMany(db.class, {
    foreignKey: 'classId'
});
db.class.belongsTo(db.activity);

db.user.hasMany(db.submission, {
    foreignKey: 'userId'
});
db.submission.belongsTo(db.user);

db.answer.hasMany(db.submission, {
    foreignKey: 'answerId'
});
db.submission.belongsTo(db.answer);

db.question.hasMany(db.answer, {
    foreignKey: 'questionId'
});
db.answer.belongsTo(db.question);

db.activity.hasMany(db.question, {
    foreignKey: 'activityId'
});
db.question.belongsTo(db.activity);

db.activity.hasMany(db.course, {
    foreignKey: 'courseId'
});
db.course.belongsTo(db.activity);

db.class.hasMany(db.course, {
    foreignKey: 'courseId'
});
db.course.belongsTo(db.class);

db.usertype.hasMany(db.user, {
    foreignKey: 'userTypeId'
});
db.user.belongsTo(db.usertype);


/* // FAZER SYNC
db.sequelize.sync()
    .then(() => {
        console.log('DB is successfully synchronized')
    })
    .catch(e => {
        console.log(e)
    }); */

module.exports = db;