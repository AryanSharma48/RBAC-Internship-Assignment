const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorMiddleware');
const v1Routes = require('./routes/v1');
const setupSwagger = require('./config/swagger');

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

setupSwagger(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'TaskManager API is running' });
});

app.use('/api/v1', v1Routes);

// Catch unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
