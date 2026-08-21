const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

const environment = process.env.NODE_ENV || 'development';
const requiredVariables = [environment === 'test' ? 'TEST_MONGODB_URI' : 'MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

function validateEnv() {
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
  }
}

module.exports = {
  env: environment,
  port: Number(process.env.PORT) || 5000,
  mongoUri: environment === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  refreshTokenDays: Number(process.env.JWT_REFRESH_DAYS) || 7,
  monthlyResetSchedule: process.env.MONTHLY_RESET_SCHEDULE || '5 0 1 * *',
  resetTimezone: process.env.RESET_TIMEZONE || 'Asia/Kolkata',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  seedPassword: process.env.SEED_PASSWORD || '',
  allowStandaloneKudos: process.env.ALLOW_STANDALONE_KUDOS !== 'false' && environment === 'development',
  trustProxy: process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1',
  validateEnv,
};
