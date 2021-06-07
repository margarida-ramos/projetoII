module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define("class", {
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
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Class;
};