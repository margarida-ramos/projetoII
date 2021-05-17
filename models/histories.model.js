module.exports = (sequelize, DataTypes) => {
    const History = sequelize.define("history", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "Description can not be empty!" } }
        },
        Date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: { notEmpty: { msg: "Date can not be empty!" } }
        }
    }, {
        timestamps: false
    });
    return History;
};