const db = require("../models/index.js");
const Usertype = db.usertype;

//necessary for LIKE operator
const { Op } = require('sequelize');

exports.findAll = (req, res) => {
    Usertype.findAll()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving usertypes."
            });
        });
};

exports.create = (req, res) => {

    Usertype.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New Usertype created.", location: "/usertype/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Usertype."
                });
        });
}

// List just one usertype
exports.findOne = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Usertype.findByPk(req.params.usertypeID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Usertype with id ${req.params.usertypeID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Usertype with id ${req.params.usertypeID}.`
            });
        });
};


// List just one usertype
exports.delete = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Usertype.destroy({
        where: {
            id: req.params.usertypeID
        }
    })
        .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                res.status(200).json({
                    message: `Deleted usertype with id ${req.params.usertypeID}.`
                });
            } else {
                res.status(404).json({
                    message: `Usertype with id ${req.params.usertypeID} not found.`
                });
            }
        }, function (err) {
            res.status(500).json({
                message: err.message || "Some error occurred while creating the Usertype."
            });
        });
};

exports.update = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Usertype.findByPk(req.params.usertypeID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Usertype with id ${req.params.usertypeID}.`
                });
            else
                if (!req.body.Description) {
                    res.status(400).json({
                        message: `Error - Data fields are null!`
                    });
                }

            data.Description = req.body.Description;
            data.save();
            res.status(200).json({
                message: `Updated Usertype with id ${req.params.usertypeID}.`
            });
        })
        .catch(err => {
            res.status(500).json({
                message: `${err.message} Error retrieving Usertype with id ${req.params.usertypeID}.`
            });
        });
};
