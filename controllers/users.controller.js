const db = require("../models/index.js");
const User = db.user;
const bcrypt = require("bcryptjs");

const { Op } = require('sequelize');

const Usertype = db.usertype;

// Get all Users for logged ADMIN users
exports.getAllUsers = async (req, res) => {
    try {

        let data = await User.findAll({
            include: {
                model: Usertype,
                attributes: ["name"]
            }
        })

        if (data == '') {
            res.status(200).json({ message: "Users is empty" });
        } else {
            res.status(200).json(data);
        }
    }
    catch (err) {

        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving Users."
        });

    };

};

// Get a user by username for logged ADMIN users or for the logged user
exports.getUser = async (req, res) => {
    try {

        User.findOne({
            where: {
                username: req.params.username
            },
            attributes: {
                exclude: ['id', 'password']
            },
            include: {
                model: Usertype,
                attributes: ["name"]
            }
        })
            .then(data => {
                if (data == '')
                    res.status(404).json({
                        message: `Not found User with Username ${req.params.username}.`
                    });
                else
                    res.json(data);
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error retrieving User with Username ${req.params.username}.`
                });
            });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

//Update a user
exports.updateUser = async (req, res) => {
    try {
        User.findOne({
            where: {
                username: req.params.username
            }
        })
            .then(user => {

                if (user == '')
                    res.status(404).json({
                        message: `Not found User with Username ${req.params.username}.`
                    });
                else if (!req.body.name || !req.body.password) {
                    res.status(400).json({
                        message: `Error - Data fields are null!`
                    });
                }

                user.name = req.body.name;
                user.password = bcrypt.hashSync(req.body.password, 8);
                user.save();

                res.status(200).json({
                    message: `Updated User with username ${req.params.username}.`
                });

                res.json(user);
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error retrieving User with Username ${req.params.username}.`
                });
            });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

// Delete a user only by an admin
exports.deleteUser = async (req, res) => {

    try {

        User.destroy({
            where: {
                username: req.params.username
            }
        })
            .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    res.status(200).json({
                        message: `Deleted User with username ${req.params.username}.`
                    });
                } else {
                    res.status(404).json({
                        message: `Username ${req.params.username} not found.`
                    });
                }
            }, function (err) {
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the User."
                });
            });

    }
    catch (err) {

        res.status(500).json({ message: err.message });

    };

};