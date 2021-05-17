const express = require('express');
let router = express.Router();
const questionController = require('../controllers/questions.controller.js');

// middleware for all routes related with questions
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(questionController.findAll)
    .post(questionController.create);

router.route('/:questionID')
    .get(questionController.findOne)
    .delete(questionController.delete)
    .put(questionController.update);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'QUESTIONS: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;