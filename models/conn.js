const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/smartBlogs";


// Define an async function to connect to MongoDB
async function connectToMongo() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectToMongo;