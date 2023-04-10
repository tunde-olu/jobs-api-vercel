const { bcryptHashedPassword, bcryptComparePassword } = require('../utils/bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a name'],
		minLength: 3,
		maxLength: 50,
	},
	email: {
		type: String,
		required: [true, 'Please provide email'],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please provide valid email',
		],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide password'],
		minLength: 6,
	},
});

UserSchema.pre('save', async function () {
	this.password = await bcryptHashedPassword(this.password);
});

UserSchema.methods.createJWT = function () {
	return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	});
};

UserSchema.methods.comparePassword = async function (pass) {
	return bcryptComparePassword(pass, this.password);
};

module.exports = mongoose.model('User', UserSchema);
