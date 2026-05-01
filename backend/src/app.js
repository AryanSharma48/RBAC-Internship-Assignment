const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middlewares/errorMiddleware');
const v1Routes = require('./routes/v1');
const setupSwagger = require('./config/swagger');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Swagger
setupSwagger(app);

// Mount routers
app.use('/api/v1', v1Routes);

// Error handler
app.use(errorHandler);

module.exports = app;
