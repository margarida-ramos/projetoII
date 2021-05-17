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
db.history = require("./histories.model.js")(sequelize, DataTypes);
db.badge = require("./badges.model.js")(sequelize, DataTypes);
db.notification = require("./notifications.model.js")(sequelize, DataTypes);
db.submission = require("./submissions.model.js")(sequelize, DataTypes);
db.question = require("./questions.model.js")(sequelize, DataTypes);

//define the User-Badge m:n relationship
db.badge.belongsToMany(db.user, { through: 'UserBadges' });
db.user.belongsToMany(db.badge, { through: 'UserBadges' });

//define 1:N relationships
db.course.hasMany(db.activity);
db.activity.belongsTo(db.course);

db.class.hasMany(db.activity);
db.activity.belongsTo(db.class);

db.user.hasMany(db.history);
db.history.belongsTo(db.user);

db.history.belongsTo(db.activity);
db.activity.hasMany(db.history);

db.user.hasMany(db.notification);
db.notification.belongsTo(db.user);

db.activity.hasMany(db.question);
db.question.belongsTo(db.activity);

db.submission.hasMany(db.question);
db.question.belongsTo(db.submission);

db.user.hasMany(db.submission);
db.submission.belongsTo(db.user);

db.course.hasMany(db.user);
db.user.belongsTo(db.course);

db.usertype.hasMany(db.user);
db.user.belongsTo(db.usertype);

/* FAZER SYNC
db.sequelize.sync()
.then(() => {
    console.log('DB is successfully synchronized')
})
.catch(e => {
    console.log(e)
}); */

module.exports = db;