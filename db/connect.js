const mongoose = require('mongoose');

const connectDB = (uri) => {
	return mongoose.connect(uri, { dbName: '06-Jobs-API' });
};

module.exports = connectDB;
