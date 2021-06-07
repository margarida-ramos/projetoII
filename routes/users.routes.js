const express = require('express');
const authController = require("../controllers/auth.controller.js");
const userController = require("../controllers/users.controller.js");
let router = express.Router();

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})

router.route('/')
    .get(authController.verifyToken, authController.isAdmin, userController.getAllUsers)

router.route('/:username')
    .get(authController.verifyToken, authController.isAdminOrLoggedUser, userController.getUser)
    .put(authController.verifyToken, authController.isAdminOrLoggedUser, userController.updateUser)
    .delete(authController.verifyToken, authController.isAdmin, userController.deleteUser)

router.all('*', function (req, res) {
    res.status(404).json({ message: 'AUTHENTICATION: what???' });
})

module.exports = router;