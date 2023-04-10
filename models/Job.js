const { Schema, model, Types, default: mongoose } = require('mongoose');

const JobSchema = new Schema(
	{
		company: {
			type: String,
			required: [true, 'Please provide company name'],
			maxLength: 100,
		},
		position: {
			type: String,
			required: [true, 'Please provide position'],
			maxLength: 100,
		},
		status: {
			type: String,
			enum: {
				values: ['interview', 'declined', 'pending'],
				message: '{VALUE} is not supported',
			},
			default: 'pending',
		},
		createdBy: {
			type: Types.ObjectId,
			ref: 'User',
			required: [true, 'Please provide user'],
		},
	},
	{ timestamps: true }
);

module.exports = model('Job', JobSchema);
