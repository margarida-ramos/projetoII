module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("course", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "Name can not be empty!" } }
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });
    return Course;
};