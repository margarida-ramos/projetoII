module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("course", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "Title can not be empty!" } }
        }
    }, {
        timestamps: false
    });
    return Course;
};