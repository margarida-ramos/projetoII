const db = require("../models/index.js");
const History = db.history;

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
    const histories = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, histories, totalPages, currentPage };
};

exports.findAll = (req, res) => {
    //get data from request query string
    let { page, size, Description } = req.query;
    const condition = Description ? { description: { [Op.like]: `%${Description}%` } } : null;

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

    History.findAndCountAll({ where: condition, limit, offset })
        .then(data => {
            // convert response data into custom format
            const response = getPagingData(data, offset, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving histories."
            });
        });
};

exports.create = (req, res) => {

    History.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New History created.", location: "/history/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the History."
                });
        });
}

// List just one history
exports.findOne = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    History.findByPk(req.params.historyID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found History with id ${req.params.historyID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving History with id ${req.params.historyID}.`
            });
        });
};


// List just one history
exports.delete = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    History.destroy({
        where: {
            id: req.params.historyID
        }
    })
        .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                res.status(200).json({
                    message: `Deleted history with id ${req.params.historyID}.`
                });
            } else {
                res.status(404).json({
                    message: `History with id ${req.params.historyID} not found.`
                });
            }

        }, function (err) {
            res.status(500).json({
                message: err.message || "Some error occurred while creating the History."
            });
        });
};

exports.update = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    History.findByPk(req.params.historyID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found History with id ${req.params.historyID}.`
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
                message: `Updated History with id ${req.params.historyID}.`
            });
        })
        .catch(err => {
            res.status(500).json({
                message: `${err.message} Error retrieving History with id ${req.params.historyID}.`
            });
        });
};


/*

// List just one history
exports.update = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    History.update(req.body,

    {
        where: {
            id: req.params.historyID
        }
    })
    .then(function(rowUpdated){
        if(rowUpdated === 1){
            res.status(200).json({
                message: `Updated history with id ${req.params.historyID}.`
            });
         }
         else
         {
            res.status(500).json({
                message: err.message || "Some error occurred while creating the History."
            });
         }
      }, function(err){
        res.status(500).json({
            message: err.message || "Some error occurred while creating the History."
        });
      });
};

*/