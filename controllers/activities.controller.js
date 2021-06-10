const db = require("../models/index.js");
const Activity = db.activity;

//necessary for LIKE operator
const { Op } = require('sequelize');
const { activity } = require("../models/index.js");

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
            classId: req.body.classId
        });

        return res.json({ message: "Activity was created successfully!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

//Update a activity only by Admin
exports.updateActivity = async (req, res) => {
    try {
        Activity.findOne({
            where: {
                id: req.params.id
            }
        })
            .then(activity => {

                if (activity == '')
                    res.status(404).json({
                        message: `Not found activity with id ${req.params.username}.`
                    });
                else if (!req.body.title || !req.body.level || !req.body.classId) {
                    res.status(400).json({
                        message: `Error - Data fields are null!`
                    });
                }

                activity.title = req.body.title;
                activity.level = req.body.level;
                activity.classId = req.body.classId
                activity.save();

                res.status(200).json({
                    message: `Updated activity with id ${req.params.id}.`
                });

                res.json(activity);
            })
            .catch(err => {
                console.log('err', err);
                res.status(500).json({
                    message: `Error retrieving activity with id ${req.params.id}.`
                });
            });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

// Get a activity by id for logged ADMIN users or for the logged user
exports.getActivity = async (req, res) => {
    try {

        Activity.findOne({
            where: {
                id: req.params.id
            }
        })
            .then(data => {
                if (data == '')
                    res.status(404).json({
                        message: `Not found activity with id ${req.params.id}.`
                    });
                else {
                    res.json(data);
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error retrieving activity with id ${req.params.id}.`
                });
            });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};