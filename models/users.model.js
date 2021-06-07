module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            allowNull: false,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: { notEmpty: { msg: "Username can not be empty!" } }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "Name can not be empty!" } }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "Password can not be empty!" } }
        },
        sex: {
            type: DataTypes.STRING
        },
        profilePicURI: {
            type: DataTypes.STRING
        },
        points: {
            type: DataTypes.INTEGER
        },
        coins: {
            type: DataTypes.INTEGER
        },
        userTypeId: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
    //User.removeAttribute('id');

    return User;
};