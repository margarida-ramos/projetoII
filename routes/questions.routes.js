const express = require('express');
let router = express.Router();
const authController = require("../controllers/auth.controller.js");
const questionController = require('../controllers/questions.controller.js');

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})

router.route('/')
    .get(authController.verifyToken, authController.isAdmin, questionController.getAllQuestions)
    .post(authController.verifyToken, authController.isAdmin, questionController.createQuestion)

router.route('/:id')
    .delete(authController.verifyToken, authController.isAdmin, questionController.deleteQuestion)


router.all('*', function (req, res) {
    res.status(404).json({ message: 'QUESTIONS: Something went wrong...' });
})

module.exports = router;