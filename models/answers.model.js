module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define("answer", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        correctAnswer: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Answer;
};