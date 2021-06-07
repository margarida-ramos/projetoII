const db = require("../models/index.js");
const Activity = db.activity;

//necessary for LIKE operator
const { Op } = require('sequelize');

/* 
exports.create = (req, res) => {

    Activity.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New Activity created.", location: "/activity/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Activity."
                });
        });
}

// List just one activity
exports.findOne = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Activity.findByPk(req.params.activityID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Activity with id ${req.params.activityID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Activity with id ${req.params.activityID}.`
            });
        });
};


// List just one activity
exports.delete = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Activity.destroy({
        where: {
            id: req.params.activityID
        }
    })
        .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                res.status(200).json({
                    message: `Deleted activity with id ${req.params.activityID}.`
                });
            } else {
                res.status(404).json({
                    message: `Activity with id ${req.params.activityID} not found.`
                });
            }
        }, function (err) {
            res.status(500).json({
                message: err.message || "Some error occurred while creating the Activity."
            });
        });
};

exports.update = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Activity.findByPk(req.params.activityID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Activity with id ${req.params.activityID}.`
                });
            else
                if (!req.body.Title || !req.body.Level) {
                    res.status(400).json({
                        message: `Error - Data fields are null!`
                    });
                }

            data.Title = req.body.Title;
            data.Level = req.body.Level;
            data.save();
            res.status(200).json({
                message: `Updated Activity with id ${req.params.activityID}.`
            });
        })
        .catch(err => {
            res.status(500).json({
                message: `${err.message} Error retrieving Activity with id ${req.params.activityID}.`
            });
        });
}; */

// Get all activities for logged user or Admin
exports.getAllActivities = async (req, res) => {
    try {

        Activity.findAll(res.body)
            .then(data => {
                if (data == '') {
                    res.status(200).json({ message: "Activity is empty" });
                } else {
                    res.status(200).json(data);
                }

            })
            .catch(err => {
                res.status(500).json({
                    message:
                        err.message || "Some error occurred while retrieving Activities."
                });
            });

    }
    catch (err) {

        res.status(500).json({ message: err.message });

    };

};

// Create new activity only by Admin
exports.createNewActivity = async (req, res) => {
    try {
        // check duplicate username
        let activity = await Activity.findOne(
            { where: { title: req.body.title } }
        );
        if (activity)
            return res.status(400).json({ message: "Failed! This Title for activity is already in use!" });
        // save activity to database
        activity = await Activity.create({
            title: req.body.title,
            level: req.body.level,
            courseId: req.body.courseId,
            classId: req.body.classId
        });

        return res.json({ message: "Activity was created successfully!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};