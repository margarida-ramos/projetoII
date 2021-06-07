const express = require('express');
let router = express.Router();
const authController = require("../controllers/auth.controller.js");
const activityController = require('../controllers/activities.controller.js');

// middleware for all routes related with activities
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})

/* router.route('/')
    .get(activityController.findAll)
    .post(activityController.create);

router.route('/:activityID')
    .get(activityController.findOne)
    .delete(activityController.delete)
    .put(activityController.update);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'ACTIVITIES: what???' });
}) */

router.route('/')
    .get(authController.verifyToken, authController.isAdminOrLoggedUser, activityController.getAllActivities)
    .post(authController.verifyToken, authController.isAdmin, activityController.createNewActivity)

router.all('*', function (req, res) {
    res.status(404).json({ message: 'AUTHENTICATION activities: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;