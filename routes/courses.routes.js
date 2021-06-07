const express = require('express');
let router = express.Router();
const authController = require("../controllers/auth.controller.js");
const courseController = require('../controllers/courses.controller.js');

// middleware for all routes related with courses
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})

/* router.route('/')
    .get(courseController.findAll)
    .post(courseController.create);

router.route('/:courseID')
    .get(courseController.findOne)
    .delete(courseController.delete)
    .put(courseController.update);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'COURSES: what???' });
}) */

router.route('/')
    .get(authController.verifyToken, authController.isAdminOrLoggedUser, courseController.getAllCourses)
    .post(authController.verifyToken, authController.isAdmin, courseController.createNewCourse)

router.route('/:id')
    .delete(authController.verifyToken, authController.isAdmin, courseController.deleteCourse)

router.all('*', function (req, res) {
    res.status(404).json({ message: 'AUTHENTICATION Courses: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;