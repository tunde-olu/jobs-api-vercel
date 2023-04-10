const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		message: err.message || 'Something went wrong try again later',
	};

	// if (err instanceof CustomAPIError) {
	// 	return res.status(err.statusCode).json({ msg: err.message });
	// }

	if (err.code && err.code === 11000) {
		const entries = Object.entries(err.keyValue);
		customError.statusCode = StatusCodes.BAD_REQUEST;
		customError.message = `The ${entries[0][0]} ${entries[0][1]} already exist`;
	}

	if (err.name === 'ValidationError') {
		const values = Object.values(err.errors)
			.map((item) => item.message)
			.join(' - ');

		customError.statusCode = StatusCodes.BAD_REQUEST;
		customError.message = values;
	}

	if (err.name === 'CastError') {
		customError.statusCode = StatusCodes.NOT_FOUND;
		customError.message = `No item found with id : ${err.value}`;
	}

	// return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
	return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
