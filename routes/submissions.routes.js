const express = require('express');
let router = express.Router();
const submissionController = require('../controllers/submissions.controller.js');
const authController = require("../controllers/auth.controller.js");


router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})

router.route('/')
    .get(authController.verifyToken, authController.isAdminOrLoggedUser, submissionController.getAllSubmissions)
    .post(authController.verifyToken, authController.isAdminOrLoggedUser, submissionController.createSubmission)

router.route('/:id')
    .get(authController.verifyToken, authController.isAdminOrLoggedUser, submissionController.getAllSubmissionsForUser)
router.all('*', function (req, res) {
    res.status(404).json({ message: 'SUBMISSIONS: Something went wrong...' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;