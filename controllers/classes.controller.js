const db = require("../models/index.js");
const Class = db.class;

//necessary for LIKE operator
const { Op } = require('sequelize');

exports.findAll = (req, res) => {

    Class.findAll()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving classes."
            });
        });
};

exports.create = (req, res) => {

    Class.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New Class created.", location: "/class/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Class."
                });
        });
}

// List just one class
exports.findOne = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Class.findByPk(req.params.classID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Class with id ${req.params.classID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Class with id ${req.params.classID}.`
            });
        });
};


// List just one class
exports.delete = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Class.destroy({
        where: {
            id: req.params.classID
        }
    })
        .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                res.status(200).json({
                    message: `Deleted class with id ${req.params.classID}.`
                });
            } else {
                res.status(404).json({
                    message: `Class with id ${req.params.classID} not found.`
                });
            }
        }, function (err) {
            res.status(500).json({
                message: err.message || "Some error occurred while creating the Class."
            });
        });
};

exports.update = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Class.findByPk(req.params.classID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Class with id ${req.params.classID}.`
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
                message: `Updated Class with id ${req.params.classID}.`
            });
        })
        .catch(err => {
            res.status(500).json({
                message: `${err.message} Error retrieving Class with id ${req.params.classID}.`
            });
        });
};
