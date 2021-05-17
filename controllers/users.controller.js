const db = require("../models/index.js");
const User = db.user;

const { Op } = require('sequelize');


exports.findAll = (req, res) => {

    User.findAll(res.body)
        .then(data => {
            if (data == '') {
                res.status(200).json({ message: "Users is empty" });
            } else {
                res.status(200).json(data);
            }

        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        });
};


exports.create = (req, res) => {

    User.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New User created.", location: "/user/" + data.Username });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the User."
                });
        });
};




// Display list of all badges for a given user (with user info)
exports.getBadges = (req, res) => {

    User.findByPk(req.params.userID,
        {
            include: {
                model: Badge,
                through: { attributes: [] } //remove data retrieved from join table
            }
        })
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found User with id ${req.params.userID}.`
                });
            else
                res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Badges for User with id ${req.params.userID}.`
            });
        });
};




exports.findOne = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    User.findByPk(req.params.username)
        .then(data => {
            if (data === null)
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
};


exports.delete = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
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
};


exports.update = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    User.findByPk(req.params.username)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found User with username ${req.params.username}.`
                });
            else
                if (!req.body.Username || !req.body.Name || !req.body.BirthDate || !req.body.Password) {
                    res.status(400).json({
                        message: `Error - Data fields are null!`
                    });
                }

            data.Name = req.body.Name;
            data.BirthDate = req.body.BirthDate;
            data.Username = req.body.Username;
            data.Password = req.body.Password;

            data.save();
            res.status(200).json({
                message: `Updated User with username ${req.params.username}.`
            });
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving User with username ${req.params.username}.`
            });
        });
};