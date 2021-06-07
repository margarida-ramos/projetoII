const db = require("../models/index.js");
const Class = db.class;

//necessary for LIKE operator
const { Op } = require('sequelize');

/* exports.findAll = (req, res) => {

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
}; */


// Get all courses for logged user or Admin
exports.getAllClasses = async (req, res) => {
    try {

        Class.findAll(res.body)
            .then(data => {
                if (data == '') {
                    res.status(200).json({ message: "Classes is empty" });
                } else {
                    res.status(200).json(data);
                }

            })
            .catch(err => {
                res.status(500).json({
                    message:
                        err.message || "Some error occurred while retrieving Classes."
                });
            });

    }
    catch (err) {

        res.status(500).json({ message: err.message });

    };

};

// Create new course only by Admin
exports.createNewClass = async (req, res) => {
    try {
        // check duplicate username
        let classe = await Class.findOne(
            { where: { name: req.body.name } }
        );
        if (classe)
            return res.status(400).json({ message: "Failed! This name for course is already in use!" });
        // save User to database
        classe = await Class.create({
            name: req.body.name,
            description: req.body.description,
            courseId: req.body.courseId
        });

        return res.json({ message: "Course was created successfully!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

// Delete a course only by an admin
exports.deleteClass = async (req, res) => {

    try {

        Class.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    res.status(200).json({
                        message: `Deleted class with id ${req.params.id}.`
                    });
                } else {
                    res.status(404).json({
                        message: `Id ${req.params.id} not found.`
                    });
                }
            }, function (err) {
                res.status(500).json({
                    message: err.message || "Some error occurred while deleting the classes."
                });
            });

    }
    catch (err) {

        res.status(500).json({ message: err.message });

    };

};
