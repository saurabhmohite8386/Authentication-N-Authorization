const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {console.log("DB connect successfully!!!");})
    .catch( (error) => {
        console.log("DB not connected");
        console.log(error);
        process.exit(1);
    }
    )
}