const express = require('express');
let router = express.Router();
const historyController = require('../controllers/histories.controller.js');

// middleware for all routes related with histories
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(historyController.findAll)
    .post(historyController.create);

router.route('/:historyID')
    .get(historyController.findOne)
    .delete(historyController.delete)
    .put(historyController.update);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'HISTORIES: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;