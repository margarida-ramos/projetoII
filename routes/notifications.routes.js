const express = require('express');
let router = express.Router();
const notificationController = require('../controllers/notifications.controller.js');

// middleware for all routes related with notifications
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(notificationController.findAll)
    .post(notificationController.create);

router.route('/:notificationID')
    .get(notificationController.findOne)
    .delete(notificationController.delete)
    .put(notificationController.update);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'NOTIFICATIONS: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;