const mongoose = require('mongoose');

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri, {});
        console.log('MonoDB Connected');
    }
    catch (error) {
        console.error('MongoDB Connection Error :', error.message);
        process.exit(1);
    }

};

module.exports = connectDB;