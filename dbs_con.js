// db.js 
const mongoose = require("mongoose"); 
const connectDB = async () => { 
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/db_demo1', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB is connected");
    } catch (err) {
        console.log("Not connected",err);
        process.exit(1); // Exit process with failure
    } 
};
module.exports = connectDB;
