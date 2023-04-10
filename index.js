require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

/* Extra security packages */
const hemlet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// connectDB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// router
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages

app.set('trust proxy', 1);

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.json());
app.use(hemlet());
app.use(cors());
app.use(xss());
app.use(apiLimiter);

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
	await connectDB(process.env.MONGO_URI);
	app.listen(port, () => {
		console.log(`Server is listening on port ${port}...`);
	});
};

start();
