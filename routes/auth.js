const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const fetchUser = require("../middleware/fetchuser");
const upload = require('../middleware/saveImg');

const JWT_SECRET = 'secret@code';

//Route 1:  create a user using post
router.post("/createuser", upload.single('profileImage'), [
    body('username', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
    body('profileImage', 'Please select profile image.'),
], async (req, res) => {
    try {
        console.log("request data: ", req.body)

        const errors = validationResult(req);
        console.log(errors)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        const seccPass = await bcrypt.hash(req.body.password, salt);

        const user = User({
            username: req.body.username,
            email: req.body.email,
            password: seccPass,
            profileImage: req.file.filename, // Store the filename in the database
        });
        console.log("created user: ", user)
        user.save();
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.send(authtoken);
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }

})

//Route 2: login user
router.post("/login", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),
], async (req, res) => {
    console.log("login: ", req.body)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.send(authtoken);
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }

})

//Route 3: Get user details
router.post("/getuser", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")

        res.send(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }
})

module.exports = router;