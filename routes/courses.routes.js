const express = require('express');
let router = express.Router();
const courseController = require('../controllers/courses.controller.js');

// middleware for all routes related with courses
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(courseController.findAll)
    .post(courseController.create);

router.route('/:courseID')
    .get(courseController.findOne)
    .delete(courseController.delete)
    .put(courseController.update);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'COURSES: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;