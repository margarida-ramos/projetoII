const express = require('express');
let router = express.Router();
const userController = require('../controllers/users.controller.js');

// middleware for all routes related with users
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(userController.findAll)
    .post(userController.create)

router.route('/:username')
    .get(userController.findOne)
    .delete(userController.delete)
    .put(userController.update)

//send a predefined error message for invalid routes on USERS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'USERS: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;