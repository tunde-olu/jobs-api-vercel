const bcrypt = require('bcryptjs');

const bcryptHashedPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

const bcryptComparePassword = async (password, hash) => {
	return bcrypt.compare(password, hash).then((res) => res === true);
};

module.exports = { bcryptHashedPassword, bcryptComparePassword };
