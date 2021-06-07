module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("question", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "Question can not be empty!" } }
        },
        imageURI: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: { notEmpty: { msg: "ImageURI can not be empty!" } }
        },
        activityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Question;
};