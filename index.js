require('dotenv').config();         // read environment variables from .env file
const express = require('express');
const cors = require('cors');       // middleware to enable CORS (Cross-Origin Resource Sharing)

const app = express();
const port = process.env.PORT || 8080;	 	// if not defined, use port 8080
const host = process.env.HOST || '127.0.0.1'; 	// if not defined, localhost


app.use(express.json());

// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({ message: 'home -- PROJETO II api' });
});

// routing middleware for resources
app.use('/activities', require('./routes/activities.routes.js'))
app.use('/courses', require('./routes/courses.routes.js'))
app.use('/usertypes', require('./routes/usertypes.routes.js'))
app.use('/classes', require('./routes/classes.routes.js'))
app.use('/badges', require('./routes/badges.routes.js'))
app.use('/histories', require('./routes/histories.routes.js'))
app.use('/notifications', require('./routes/notifications.routes.js'))
app.use('/questions', require('./routes/questions.routes.js'))
app.use('/submissions', require('./routes/submissions.routes.js'))
app.use('/users', require('./routes/users.routes.js'))

// handle invalid routes
app.get('*', function (req, res) {
    res.status(404).json({ message: 'WHAT???' });
})

app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));