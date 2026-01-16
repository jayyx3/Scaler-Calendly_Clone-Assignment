const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const eventTypesRoutes = require('./routes/eventTypes');
const availabilityRoutes = require('./routes/availability');
const bookingsRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allow all origins
app.use(cors());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/event-types', eventTypesRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Calendly Clone API. The server is running correctly.');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Calendly Clone API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Don't use app.listen on Vercel - it's serverless
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
