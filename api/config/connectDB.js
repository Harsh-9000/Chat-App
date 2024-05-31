const mongoose = require('mongoose');

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Connected to DB Successfully !!!");

        const connection = mongoose.connection;

        connection.on('error', (error) => {
            console.log("Something went wrong in connecting to DB", error);
        });
    }).catch((error) => {
        console.log("Something went wrong", error);
    });
}

module.exports = connectDB;
