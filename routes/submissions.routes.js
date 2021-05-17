const express = require('express');
let router = express.Router();
const submissionController = require('../controllers/submissions.controller.js');

// middleware for all routes related with submissions
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(submissionController.findAll)
    .post(submissionController.create);

router.route('/:submissionID')
    .get(submissionController.findOne)
    .delete(submissionController.delete)
    .put(submissionController.update);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'SUBMISSIONS: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;