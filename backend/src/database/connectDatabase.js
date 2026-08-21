const mongoose = require('mongoose');
const config = require('../config/env');

async function connectDatabase() {
  await mongoose.connect(config.mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

module.exports = connectDatabase;
