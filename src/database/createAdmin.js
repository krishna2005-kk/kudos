const mongoose = require('mongoose');
const config = require('../config/env');
const connectDatabase = require('./connectDatabase');
const User = require('../modules/users/user.model');

async function createAdmin() {
  if (config.env !== 'development') throw new Error('Admin creation is available only in development');
  config.validateEnv();
  if (!config.adminEmail || !config.adminPassword) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before creating an administrator');
  }
  await connectDatabase();

  let user = await User.findOne({ email: config.adminEmail });
  if (!user) {
    user = await User.create({
      name: 'Kudos Administrator', email: config.adminEmail, password: config.adminPassword, department: 'Engineering', role: 'admin', isEmailVerified: true,
    });
    console.log(`Created administrator account: ${config.adminEmail}`);
  } else {
    user.role = 'admin';
    await user.save();
    console.log(`Existing user is now an administrator: ${config.adminEmail}`);
  }
}

createAdmin()
  .catch((error) => { console.error('Admin setup failed:', error.message); process.exitCode = 1; })
  .finally(async () => mongoose.disconnect());
