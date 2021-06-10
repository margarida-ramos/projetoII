const db = require("../models/index.js");
const Question = db.question;

//necessary for LIKE operator
const { Op } = require('sequelize');

const Activity = db.activity;


// List just one question
exports.findOne = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Question.findByPk(req.params.questionID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Question with id ${req.params.questionID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Question with id ${req.params.questionID}.`
            });
        });
};


// List just one question
exports.delete = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Question.destroy({
        where: {
            id: req.params.questionID
        }
    })
        .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                res.status(200).json({
                    message: `Deleted question with id ${req.params.questionID}.`
                });
            } else {
                res.status(404).json({
                    message: `Question with id ${req.params.questionID} not found.`
                });
            }
        }, function (err) {
            res.status(500).json({
                message: err.message || "Some error occurred while creating the Question."
            });
        });
};

exports.update = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Question.findByPk(req.params.questionID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Question with id ${req.params.questionID}.`
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
                message: `Updated Question with id ${req.params.questionID}.`
            });
        })
        .catch(err => {
            res.status(500).json({
                message: `${err.message} Error retrieving Question with id ${req.params.questionID}.`
            });
        });
};


// Get all Questions only for logged ADMIN users
exports.getAllQuestions = async (req, res) => {
    try {

        let data = await Question.findAll({
            include: {
                model: Activity,
                attributes: ["title", "level"]
            },
            attributes: {
                exclude: ['activityId']
            }
        })

        if (data == '') {
            res.status(200).json({ message: "Question is empty" });
        } else {
            res.status(200).json(data);
        }
    }
    catch (err) {

        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving Questions."
        });

    };

};

// Create new Question
exports.createQuestion = async (req, res) => {
    try {
        Question.create(req.body)
            .then(data => {
                res.status(201).json({ message: "New Question created.", location: "/question/" + data.id });
            })
            .catch(err => {
                if (err.name === 'SequelizeValidationError')
                    res.status(400).json({ message: err.errors[0].message });
                else
                    res.status(500).json({
                        message: err.message || "Some error occurred while creating the Question."
                    });
            });
    } catch (error) {

        res.status(500).json({ message: err.message });

    }

}

// Delete Question only by admin
exports.deleteQuestion = async (req, res) => {

    try {

        Question.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    res.status(200).json({
                        message: `Deleted Question with id ${req.params.id}.`
                    });
                } else {
                    res.status(404).json({
                        message: `Question with id ${req.params.id} not found.`
                    });
                }
            }, function (err) {
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Question."
                });
            });

    }
    catch (err) {

        res.status(500).json({ message: err.message });

    };

};
