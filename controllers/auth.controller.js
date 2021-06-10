const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");
const db = require("../models");
const { usertype } = require("../models");
const User = db.user;

exports.signup = async (req, res) => {
    try {
        // check duplicate username
        let user = await User.findOne(
            { where: { username: req.body.username } }
        );
        if (user)
            return res.status(400).json({ message: "Failed! Username is already in use!" });

        // save User to database
        user = await User.create({
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, 8) // generates hash to password
        });

        if (req.body.usertype) {
            let usertype = await Usertype.findOne({ where: { name: req.body.usertype } });
            if (usertype)
                await user.setUserType(usertype);
        }
        else
            await user.setUserType(1); // user usertype = 0( Regular)
        return res.json({ message: "User was registered successfully!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

exports.signin = async (req, res) => {
    try {
        let user = await User.findOne({ where: { username: req.body.username } });
        if (!user) return res.status(404).json({ message: "User Not found." });
        // tests a string (password in body) against a hash (password in database)
        const passwordIsValid = bcrypt.compareSync(
            req.body.password, user.password
        );
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null, message: "Invalid Password!"
            });
        }
        // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 1296000 // 15 dias
        });

        let usertype = await user.getUserType();
        //console.log(usertype)
        return res.status(200).json({
            id: user.id, username: user.username,
            email: user.email, usertype: usertype.name.toUpperCase(), accessToken: token
        });
    } catch (err) { res.status(500).json({ message: err.message }); };
};

exports.verifyToken = (req, res, next) => {

    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    // verify request token given the JWT secret key
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.loggedUserId = decoded.id; // save user ID for future verifications
        console.log('req.loggedUserId:' + req.loggedUserId);
        next();
    });
};

exports.isProfessor = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let usertype = await user.getUserType();

    if (usertype.id === 2)
        return next();

    return res.status(403).send({ message: "Require Professor or Admin Usertype!" })
}

exports.isAdmin = async (req, res, next) => {

    let user = await User.findByPk(req.loggedUserId);
    let usertype = await user.getUserType();

    if (usertype.id === 1)
        return next();

    return res.status(403).send({ message: "Require Admin Usertype!" })
};


exports.isAdminOrLoggedUser = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let usertype = await user.getUserType();
    if (usertype.name === "Admin" || (user.username == req.params.username))
        return next();
    return res.status(403).send({
        message: "Require Logged user or Admin Usertype!"
    });
};

