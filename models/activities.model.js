module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define("activity", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "Title can not be empty!" } }
        },
        level: {
            type: DataTypes.INTEGER
        },
        courseId: {
            type: DataTypes.INTEGER
        },
        classId: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
    return Activity;
};