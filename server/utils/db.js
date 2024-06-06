const mongoose = require("mongoose");

// const URI = "mongodb+srv://suvidvyas:HanuRam007@cluster0.x6avcro.mongodb.net/mern_admin?retryWrites=true&w=majority&appName=Cluster0";

// const URI = "mongodb://localhost:27017/mern_admin";
// mongoose.connect(URI);

const URI = process.env.MONGODB_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(URI);
        console.log("connection successful to DB");
    }
    catch (error) {
        console.log("database connection failed");
        process.exit(0);
    }
};

module.exports = connectDb;
