const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchuser");
const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');

//Route 1: Get All the profiles
router.get('/GetAllProfiles', fetchUser, async (req, res) => {
    try {
        const profile = await User.find().select('username profileImage')
        res.json(profile)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }
})

//Route 1: Get own profile
router.get('/GetProfile', fetchUser, async (req, res) => {
    try {
        // Fetch the user's blog profile
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        // Fetch user details (name)
        const user = await User.findById(req.user.id).select("-_id username email profileImage");
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Fetch all posts of the user
        const userPosts = await Post.find({ author: req.user.id }).select("-_id title description date tags");
        res.json({
            user: user,
            bio: profile.bio,
            links: profile.links,
            posts: userPosts
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }
})
//Route 3: Add a new Profile
router.post('/addprofile', fetchUser, [
    body('bio', 'bio must be atleast 3 characters').isLength({ min: 3 }),
], async (req, res) => {
    console.log("post: ", req.body)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { bio, links } = req.body;
        const newProfile = new Profile({
            bio, links, user: req.user.id
        })

        const saveProfile = await newProfile.save();
        res.json(saveProfile)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }

})
module.exports = router;