const db = require("../models/index.js");
const Usertype = db.usertype;

//necessary for LIKE operator
const { Op } = require('sequelize');
const { usertype, user } = require("../models/index.js");

// Get all Usertypes only for logged ADMIN users
exports.getAllUserTypes = async (req, res) => {
    try {

        let data = await Usertype.findAll()

        if (data == '') {
            res.status(200).json({ message: "Usertypes is empty" });
        } else {
            res.status(200).json(data);
        }
    }
    catch (err) {

        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving Usertypes."
        });

    };

};

//Update by name a Usertype only by ADMIN
exports.updateUsertype = async (req, res) => {
    try {
        Usertype.findOne({
            where: {
                name: req.params.name
            }
        })
            .then(usertype => {

                if (usertype == '')
                    res.status(404).json({
                        message: `Not found Usertype with name ${req.params.name}.`
                    });
                else if (!req.body.name) {
                    res.status(400).json({
                        message: `Error - Data fields are null!`
                    });
                }

                usertype.name = req.body.name;

                usertype.save();

                res.status(200).json({
                    message: `Updated Usertype with name ${req.params.name}.`
                });

                res.json(usertype);
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error retrieving Usertype with name ${req.params.name}.`
                });
            });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

exports.createUsertype = async (req, res) => {
    try {
        Usertype.create(req.body)
            .then(data => {
                res.status(201).json({ message: "New Usertype created.", location: "/usertype/" + data.id });
            })
            .catch(err => {
                if (err.name === 'SequelizeValidationError')
                    res.status(400).json({ message: err.errors[0].message });
                else
                    res.status(500).json({
                        message: err.message || "Some error occurred while creating the Usertype."
                    });
            });
    } catch (error) {

        res.status(500).json({ message: err.message });

    }

}



// Delete usertype by name (Only Admin)
exports.deleteUsertype = async (req, res) => {

    try {

        Usertype.destroy({
            where: {
                name: req.params.name
            }
        })
            .then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    res.status(200).json({
                        message: `Deleted Usertype with name ${req.params.name}.`
                    });
                } else {
                    res.status(404).json({
                        message: `Usertype with name ${req.params.name} not found.`
                    });
                }
            }, function (err) {
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Usertype."
                });
            });

    }
    catch (err) {

        res.status(500).json({ message: err.message });

    };

};