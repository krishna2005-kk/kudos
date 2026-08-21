const AppError = require('../errors/AppError');

function getMonthRange(month) {
  const selected = month || new Date().toISOString().slice(0, 7);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(selected)) {
    throw new AppError('Month must use YYYY-MM format', 400);
  }

  const [year, monthNumber] = selected.split('-').map(Number);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));
  return { selected, start, end };
}

module.exports = { getMonthRange };
