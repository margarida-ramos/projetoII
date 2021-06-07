const db = require("../models/index.js");
const Course = db.course;

//necessary for LIKE operator
const { Op } = require('sequelize');

/* exports.findAll = (req, res) => {
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
}; */

// Get all courses for logged user or Admin
exports.getAllCourses = async (req, res) => {
    try {

        Course.findAll(res.body)
            .then(data => {
                if (data == '') {
                    res.status(200).json({ message: "Courses is empty" });
                } else {
                    res.status(200).json(data);
                }

            })
            .catch(err => {
                res.status(500).json({
                    message:
                        err.message || "Some error occurred while retrieving Courses."
                });
            });

    }
    catch (err) {

        res.status(500).json({ message: err.message });

    };

};

// Create new course only by Admin
exports.createNewCourse = async (req, res) => {
    try {
        // check duplicate username
        let course = await Course.findOne(
            { where: { name: req.body.name } }
        );
        if (course)
            return res.status(400).json({ message: "Failed! This name for course is already in use!" });
        // save User to database
        course = await Course.create({
            name: req.body.name,
            description: req.body.description,
        });

        return res.json({ message: "Course was created successfully!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

// Delete a course only by an admin
exports.deleteCourse = async (req, res) => {

    try {

        Course.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    res.status(200).json({
                        message: `Deleted course with id ${req.params.id}.`
                    });
                } else {
                    res.status(404).json({
                        message: `Id ${req.params.id} not found.`
                    });
                }
            }, function (err) {
                res.status(500).json({
                    message: err.message || "Some error occurred while deleting the course."
                });
            });

    }
    catch (err) {

        res.status(500).json({ message: err.message });

    };

};