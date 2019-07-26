const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const app = express();

const playersRoutes = require('./api/routes/players');

app.use('/players', playersRoutes);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  };

app.listen(PORT, () => {
    console.log(`🌎 ==> Server now on port ${PORT}!`);
});
