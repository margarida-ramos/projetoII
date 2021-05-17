const express = require('express');
let router = express.Router();
const badgeController = require('../controllers/badges.controller.js');
const { route } = require('./activities.routes.js');

// middleware for all routes related with badges
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(badgeController.findAll)
    .post(badgeController.create);

router.route('/:badgeID')
    .get(badgeController.findOne)
    .delete(badgeController.delete)
    .put(badgeController.update);

router.route('/:badgeID/user/:userID')
    .post(badgeController.assignBadge)
    .delete(badgeController.unassignBadge);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'BADGES: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;