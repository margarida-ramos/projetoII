const express = require('express');
let router = express.Router();
const authController = require("../controllers/auth.controller.js");
const answerController = require('../controllers/answers.controller.js');

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})

router.route('/')
    .get(authController.verifyToken, authController.isAdmin, answerController.getAllAnswers)
    .post(authController.verifyToken, authController.isAdmin, answerController.createAnswer)

router.route('/:questionId')
    .get(authController.verifyToken, authController.isAdmin, answerController.getAllAnswersForQuestion)


router.all('*', function (req, res) {
    res.status(404).json({ message: 'ANSWERS: Something went wrong...' });
})

module.exports = router;