module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {

        Username: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false,
            validate: { notEmpty: { msg: "Username can not be empty!" } }
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "Name can not be empty!" } }
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "Password can not be empty!" } }
        },
        BirthDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: { notNull: { msg: "BirthDate can not be empty!" } }
        },
        Sex: {
            type: DataTypes.STRING
        },
        ProfilePicURI: {
            type: DataTypes.STRING
        },
        Points: {
            type: DataTypes.INTEGER
        },
        Coins: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
    User.removeAttribute('id');

    return User;
};