module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define("submission", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: { notEmpty: { msg: "Read can not be empty!" } }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        answerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Submission;
};