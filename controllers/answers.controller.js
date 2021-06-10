const db = require("../models/index.js");
const Answer = db.answer;

//necessary for LIKE operator
const { Op, where } = require('sequelize');

const Question = db.question;

// Get all answers only for logged ADMIN users
exports.getAllAnswers = async (req, res) => {
    try {

        let data = await Answer.findAll({
            include: {
                model: Question,
                attributes: ["question"]
            }
        })

        if (data == '') {
            res.status(200).json({ message: "Answer is empty" });
        } else {
            res.status(200).json(data);
        }
    }
    catch (err) {

        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving Answers."
        });

    };

};

// Create new Answer
exports.createAnswer = async (req, res) => {
    try {
        Answer.create(req.body)
            .then(data => {
                res.status(201).json({ message: "New Answer created.", location: "/answer/" + data.id });
            })
            .catch(err => {
                if (err.name === 'SequelizeValidationError')
                    res.status(400).json({ message: err.errors[0].message });
                else
                    res.status(500).json({
                        message: err.message || "Some error occurred while creating the Answer."
                    });
            });
    } catch (error) {

        res.status(500).json({ message: err.message });

    }

}


// Get all answers for one question only for logged ADMIN users
exports.getAllAnswersForQuestion = async (req, res) => {
    try {

        let data = await Answer.findAll({
            include: {
                model: Question,
                attributes: ["question"]
            },
            where: {
                questionId: req.params.questionId
            }
        })

        if (data == '') {
            res.status(200).json({ message: "Answer is empty" });
        } else {
            res.status(200).json(data);
        }
    }
    catch (err) {

        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving Answers."
        });

    };

};