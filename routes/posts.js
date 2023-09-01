const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchuser");
const Post = require('../models/Post');

//Route 1: Get all the posts by user Id
router.get('/GetAllPostsById', fetchUser, async (req, res) => {
    console.log("request:", req.body)
    try {
        const posts = await Post.find({ author: req.user.id }).populate('author', 'username');
        res.json(posts)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }
})

//Route 2: Get All the posts
router.get('/GetAllPosts', fetchUser, async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }
})

//Route 3: Add a new post
router.post('/addpost', fetchUser, [
    body('title', 'Title must be atleast 3 characters').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    console.log("post: ", req.body)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tags } = req.body;
        const newPost = new Post({
            title, description, tags, author: req.user.id
        })

        const savePost = await newPost.save();
        res.json(savePost)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }

})

//Route 3: Update a post
router.put('/updatepost/:id', fetchUser, async (req, res) => {
    const { title, description, tags } = req.body;
    console
    try {
        // create a newPost object
        const newPost = {};
        if (title) { newPost.title = title; }
        if (description) { newPost.description = description; }
        if (tags) { newPost.tags = tags; }

        // find the Post to be updated and update it
        let post = await Post.findById(req.params.id)

        // if post is not exists
        if (!post) {
            return res.status(404).send("Not found!")
        }
        // if userid is not match with stored user's id (allowes updation only if user's owened post)
        if (post.author._id.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed!")
        }

        post = await Post.findByIdAndUpdate(req.params.id, { $set: newPost }, { new: true });
        res.send(post)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }
})

//Route 5: delete a post
router.delete('/deletepost/:id', fetchUser, async (req, res) => {
    try {
        // find the post to be deleted and delete it
        let post = await Post.findById(req.params.id)
        console.log("post", post)
        // if pos is not exists
        if (!post) {
            return res.status(404).send("Not found!")
        }
        // if userid is not match with stored user's id (allowes deletion only if user's owened post)
        if (post.author._id.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed!")
        }
        post = await Post.findByIdAndDelete(req.params.id);
        res.send("successfully deleted post")
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured!")
    }
})

module.exports = router;