const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500,
        required: true
    },
    links: {
        website: {
            type: String,
            trim: true
        },
        facebook: String,
        twitter: String,
        github: String
    }
}, {
    timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
