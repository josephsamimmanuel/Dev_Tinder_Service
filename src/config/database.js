const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    await mongoose.connect('mongodb+srv://josephDev:Bg7wyfTMtcgMAwNu@josephdev.2xopt.mongodb.net/devTinder');
}

module.exports = connectDB;