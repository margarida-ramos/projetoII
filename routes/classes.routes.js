const express = require('express');
let router = express.Router();
const classController = require('../controllers/classes.controller.js');

// middleware for all routes related with classes
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(classController.findAll)
    .post(classController.create);

router.route('/:classID')
    .get(classController.findOne)
    .delete(classController.delete)
    .put(classController.update);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'CLASSES: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;