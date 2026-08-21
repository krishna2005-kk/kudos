const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/env');
const connectDatabase = require('./database/connectDatabase');
const { startMonthlyResetJob } = require('./jobs/monthlyReset.job');
const { runMonthlyReset } = require('./modules/monthlyResets/monthlyReset.service');

async function startServer() {
  config.validateEnv();
  await connectDatabase();
  const resetResult = await runMonthlyReset();
  console.log(`Monthly reset startup check: ${resetResult.status} for ${resetResult.month}`);
  startMonthlyResetJob();

  const server = app.listen(config.port, () => {
    console.log(`Kudos API running on port ${config.port} in ${config.env} mode`);
  });

  async function shutdown(signal) {
    console.log(`${signal} received: closing server gracefully`);
    server.close(async () => {
      await mongoose.disconnect();
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  }

  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
