const db = require("../models/index.js");
const Submission = db.submission;
//necessary for LIKE operator
const { Op } = require('sequelize');

const User = db.user;
const Answer = db.answer;
const Question = db.question;

// Get all answers only for logged ADMIN users
exports.getAllSubmissions = async (req, res) => {
    try {

        let data = await Submission.findAll({
            include: {
                model: User,
                attributes: ["username"]
            }
        })

        if (data == '') {
            res.status(200).json({ message: "Submission is empty" });
        } else {
            res.status(200).json(data);
        }
    }
    catch (err) {

        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving Submissions."
        });

    };

};

// Create new submission
exports.createSubmission = async (req, res) => {
    try {
        Submission.create(req.body)
            .then(data => {
                res.status(201).json({ message: "New Submission created.", location: "/submission/" + data.id });
            })
            .catch(err => {
                if (err.name === 'SequelizeValidationError')
                    res.status(400).json({ message: err.errors[0].message });
                else
                    res.status(500).json({
                        message: err.message || "Some error occurred while creating the Submissions."
                    });
            });
    } catch (error) {

        res.status(500).json({ message: err.message });

    }

}


// Get all Submissions for one user only for logged ADMIN users
exports.getAllSubmissionsForUser = async (req, res) => {
    try {

        let data = await Submission.findAll({
            include: {
                model: User,
                attributes: ["username"]
            },
            where: {
                userId: req.params.userId
            }
        })

        if (data == '') {
            res.status(200).json({ message: "Submission is empty" });
        } else {
            res.status(200).json(data);
        }
    }
    catch (err) {

        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving submissions."
        });

    };

};