module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define("submission", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: { notEmpty: { msg: "Date can not be empty!" } }
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: { notEmpty: { msg: "Read can not be empty!" } }
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idAnswer: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Submission;
};