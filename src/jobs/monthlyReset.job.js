const cron = require('node-cron');
const config = require('../config/env');
const { runMonthlyReset } = require('../modules/monthlyResets/monthlyReset.service');

function startMonthlyResetJob() {
  cron.schedule(
    config.monthlyResetSchedule,
    async () => {
      try {
        const result = await runMonthlyReset();
        console.log(`Monthly reset ${result.status} for ${result.month}`);
      } catch (error) {
        console.error('Monthly reset job failed:', error.message);
      }
    },
    { timezone: config.resetTimezone }
  );
  console.log(`Monthly reset scheduled: ${config.monthlyResetSchedule} (${config.resetTimezone})`);
}

module.exports = { startMonthlyResetJob };
