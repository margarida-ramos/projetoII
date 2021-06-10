const db = require("../models/index.js");
const Class = db.class;

//necessary for LIKE operator
const { Op } = require('sequelize');


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
