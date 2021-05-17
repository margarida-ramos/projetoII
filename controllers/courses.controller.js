const db = require("../models/index.js");
const Course = db.course;

//necessary for LIKE operator
const { Op } = require('sequelize');

exports.findAll = (req, res) => {
    Course.findAll()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving courses."
            });
        });
};

exports.create = (req, res) => {

    Course.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New Course created.", location: "/course/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Course."
                });
        });
}

// List just one course
exports.findOne = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Course.findByPk(req.params.courseID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Course with id ${req.params.courseID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Course with id ${req.params.courseID}.`
            });
        });
};


// List just one course
exports.delete = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Course.destroy({
        where: {
            id: req.params.courseID
        }
    })
        .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                res.status(200).json({
                    message: `Deleted course with id ${req.params.courseID}.`
                });
            } else {
                res.status(404).json({
                    message: `Course with id ${req.params.courseID} not found.`
                });
            }
        }, function (err) {
            res.status(500).json({
                message: err.message || "Some error occurred while creating the Course."
            });
        });
};

exports.update = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Course.findByPk(req.params.courseID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Course with id ${req.params.courseID}.`
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
                message: `Updated Course with id ${req.params.courseID}.`
            });
        })
        .catch(err => {
            res.status(500).json({
                message: `${err.message} Error retrieving Course with id ${req.params.courseID}.`
            });
        });
};