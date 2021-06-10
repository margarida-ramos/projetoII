const express = require('express');
let router = express.Router();
const authController = require("../controllers/auth.controller.js");
const usertypeController = require('../controllers/usertypes.controller.js');

// middleware for all routes related with usertypes
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})

router.route('/')
    .get(authController.verifyToken, authController.isAdmin, usertypeController.getAllUserTypes)
    .post(authController.verifyToken, authController.isAdmin, usertypeController.createUsertype)


router.route('/:name')
    .put(authController.verifyToken, authController.isAdmin, usertypeController.updateUsertype)
    .delete(authController.verifyToken, authController.isAdmin, usertypeController.deleteUsertype)

router.all('*', function (req, res) {
    res.status(404).json({ message: 'USERTYPES: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;