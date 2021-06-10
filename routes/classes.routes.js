const express = require('express');
let router = express.Router();
const authController = require("../controllers/auth.controller.js");
const classController = require('../controllers/classes.controller.js');

// middleware for all routes related with classes
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})

router.route('/')
    .get(authController.verifyToken, authController.isAdminOrLoggedUser, classController.getAllClasses)
    .post(authController.verifyToken, authController.isAdmin, classController.createNewClass)

router.route('/:id')
    .delete(authController.verifyToken, authController.isAdmin, classController.deleteClass)

router.all('*', function (req, res) {
    res.status(404).json({ message: 'AUTHENTICATION Classes: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;