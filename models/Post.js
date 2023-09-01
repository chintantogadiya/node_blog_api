const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    description: {
        type: String,
        maxlength: 5000,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
})

postSchema.index({
    title: 'text',
    body: 'text',
}, {
    weights: {
        title: 5,
        body: 2
    }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post