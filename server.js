const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const app = express();
require('dotenv').config();

// Connect to remote MongoDB
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).then(() => {
  console.log('Connected to MongoDB');
}, err => {
  console.log(err);
});
// set useCreateIndex to true to fix deprecation warnings
mongoose.set('useCreateIndex', true);

// Initialize API routes
const playersRoutes = require('./api/routes/players');

// Use morgan to log all requests to console
app.use(morgan('dev'));
// Setting up bodyParser to use json and set it to req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use API routes
app.use('/players', playersRoutes);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
};

// Send every request to the React app
// Define any API routes before this runs
app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
