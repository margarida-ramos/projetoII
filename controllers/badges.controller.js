const db = require("../models/index.js");
const Badge = db.badge;

const { Op } = require('sequelize');

exports.findAll = (req, res) => {


    Badge.findAll()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving badges."
            });
        });
};

exports.create = (req, res) => {

    Badge.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New Badge created.", location: "/badge/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Badge."
                });
        });
}

// Display list of all users for a given badge (with badge info)
exports.getUsers = (req, res) => {
    // console.log(req.params.badgeID)
    Badge.findByPk(req.params.badgeID,
        {
            include: {
                model: User,
                through: { attributes: [] } //remove data retrieved from join table
            }
        })
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Badge with id ${req.params.badgeID}.`
                });
            else
                res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Users for Badge with id ${req.params.badgeID}.`
            });
        });
};


// Add one badge to one user
exports.assignBadge = (req, res) => {
    User.findByPk(req.params.userID)
        .then(user => {
            // no data returned means there is no user in DB with that given ID 
            if (user === null)
                res.status(404).json({
                    message: `Not found User with id ${req.params.userID}.`
                });
            else {
                Badge.findByPk(req.params.badgeID)
                    .then(badge => {
                        if (badge === null)
                            res.status(404).json({
                                message: `Not found Badge with id ${req.params.badgeID}.`
                            });
                        else {
                            badge.addUser(user)
                                .then(data => {
                                    if (data === undefined)
                                        res.status(200).json({
                                            message: `Badge ${req.params.badgeID} was already assigned to User ${req.params.userID}.`
                                        });
                                    else
                                        res.status(200).json({
                                            message: `Added Badge ${req.params.badgeID} to User ${req.params.userID}.`
                                        });
                                })
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || `Error adding Badge ${req.params.badgeID} to User ${req.params.userID}.`
            });
        });
};

// Remove one badge from one user
exports.unassignBadge = async (req, res) => {
    try {
        let user = await User.findByPk(req.params.userID)

        // no data returned means there is no user in DB with that given ID 
        if (user === null) {
            res.status(404).json({
                message: `Not found User with id ${req.params.userID}.`
            });
            return;
        }

        let badge = await Badge.findByPk(req.params.badgeID)

        // no data returned means there is no badge in DB with that given ID 
        if (badge === null) {
            res.status(404).json({
                message: `Not found Badge with id ${req.params.badgeID}.`
            });
            return;
        }

        let data = await badge.removeUser(user)

        // console.log(data);
        if (data === 1)
            res.status(200).json({
                message: `Removed Badge ${req.params.badgeID} to User ${req.params.userID}.`
            });
        else
            res.status(200).json({
                message: `No Badge ${req.params.badgeID} associated to User ${req.params.userID}.`
            });
    }
    catch (err) {
        res.status(500).json({
            message: err.message || `Error adding Badge ${req.params.badgeID} to User ${req.params.userID}.`
        })
    };
};

exports.findOne = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Badge.findByPk(req.params.badgeID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Badge with id ${req.params.badgeID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Badge with id ${req.params.badgeID}.`
            });
        });
};


exports.delete = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Badge.destroy({
        where: {
            id: req.params.badgeID
        }
    })
        .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                res.status(200).json({
                    message: `Deleted badge with id ${req.params.badgeID}.`
                });
            } else {
                res.status(404).json({
                    message: `Badge with id ${req.params.badgeID} not found.`
                });
            }
        }, function (err) {
            res.status(500).json({
                message: err.message || "Some error occurred while creating the Badge."
            });
        });
};

exports.update = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Badge.findByPk(req.params.badgeID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Badge with id ${req.params.badgeID}.`
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
                message: `Updated Badge with id ${req.params.badgeID}.`
            });
        })
        .catch(err => {
            res.status(500).json({
                message: `${err.message} Error retrieving Badge with id ${req.params.badgeID}.`
            });
        });
};
