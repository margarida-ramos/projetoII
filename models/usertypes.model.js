module.exports = (sequelize, DataTypes) => {
    const Usertype = sequelize.define("userType", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: { notEmpty: { msg: "name can not be empty!" } }
        }
    }, {
        timestamps: false
    });
    return Usertype;
};