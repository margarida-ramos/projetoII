const db = require("../models/index.js");
const Activity = db.activity;

//necessary for LIKE operator
const { Op } = require('sequelize');

// calculates limit and offset parameters for Sequelize Model method findAndCountAll(), 
// from API request query parameters: page and size
const getPagination = (page, size) => {
    const limit = size ? size : 10; // limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {

    const totalItems = data.count;
    const activities = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, activities, totalPages, currentPage };
};

exports.findAll = (req, res) => {
    //get data from request query string
    let { page, size, Title } = req.query;
    const condition = Title ? { title: { [Op.like]: `%${Title}%` } } : null;

    // validate page
    if (page && !req.query.page.match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Page number must be 0 or a positive integer' });
        return;
    }
    else
        page = parseInt(page); // if OK, convert it into an integer
    // validate size
    if (size && !req.query.size.match(/^([1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Size must be a positive integer' });
        return;
    } else
        size = parseInt(size); // if OK, convert it into an integer

    // convert page & size into limit & offset options for findAndCountAll
    const { limit, offset } = getPagination(page, size);

    Activity.findAndCountAll({ where: condition, limit, offset })
        .then(data => {
            // convert response data into custom format
            const response = getPagingData(data, offset, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving activities."
            });
        });
};

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
};

