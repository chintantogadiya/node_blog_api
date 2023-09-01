const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: [true, "Username is already exists"],
        },
        email: {
            type: String,
            required: true,
            unique: [true, "Email is already exists"],
        },
        password: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
            default: "",
        },
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);