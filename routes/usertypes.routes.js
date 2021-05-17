const express = require('express');
let router = express.Router();
const usertypeController = require('../controllers/usertypes.controller.js');

// middleware for all routes related with usertypes
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(usertypeController.findAll)
    .post(usertypeController.create);

router.route('/:usertypeID')
    .get(usertypeController.findOne)
    .delete(usertypeController.delete)
    .put(usertypeController.update);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'USERTYPES: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;