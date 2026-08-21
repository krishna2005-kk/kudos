const config = require('../config/env');
const connectDatabase = require('./connectDatabase');
const User = require('../modules/users/user.model');
const Kudos = require('../modules/kudos/kudos.model');
const Reaction = require('../modules/reactions/reaction.model');
const MonthlyReset = require('../modules/monthlyResets/monthlyReset.model');
const { getMonthRange } = require('../shared/utils/month');

const userDefinitions = [
  { name: 'Aarav Mehta', email: 'aarav.mehta@kudos.local', department: 'Engineering', role: 'admin' },
  { name: 'Diya Shah', email: 'diya.shah@kudos.local', department: 'Engineering' },
  { name: 'Kabir Patel', email: 'kabir.patel@kudos.local', department: 'Design' },
  { name: 'Meera Iyer', email: 'meera.iyer@kudos.local', department: 'Design' },
  { name: 'Rohan Verma', email: 'rohan.verma@kudos.local', department: 'Marketing' },
  { name: 'Ananya Rao', email: 'ananya.rao@kudos.local', department: 'Marketing' },
  { name: 'Vivaan Singh', email: 'vivaan.singh@kudos.local', department: 'Sales' },
  { name: 'Isha Nair', email: 'isha.nair@kudos.local', department: 'Sales' },
];

function assertSafeEnvironment() {
  if (config.env !== 'development') {
    throw new Error('Seeding is blocked unless NODE_ENV is development');
  }
  if (!config.seedPassword) {
    throw new Error('Set SEED_PASSWORD in .env before running the seed command');
  }
}

async function seed() {
  assertSafeEnvironment();
  await connectDatabase();

  await Promise.all([
    Reaction.deleteMany({}),
    Kudos.deleteMany({}),
    MonthlyReset.deleteMany({}),
    User.deleteMany({}),
  ]);

  const users = await User.create(userDefinitions.map((user) => ({
    ...user,
    password: config.seedPassword,
    isEmailVerified: true,
  })));

  const byEmail = Object.fromEntries(users.map((user) => [user.email, user]));
  const kudosDefinitions = [
    ['aarav.mehta@kudos.local', 'diya.shah@kudos.local', 20, 'Thank you for unblocking the API integration.', '#Teamwork'],
    ['diya.shah@kudos.local', 'kabir.patel@kudos.local', 10, 'The dashboard interaction design is excellent.', '#Innovation'],
    ['kabir.patel@kudos.local', 'meera.iyer@kudos.local', 20, 'Great support during the design review.', '#Teamwork'],
    ['meera.iyer@kudos.local', 'rohan.verma@kudos.local', 50, 'Your campaign insight helped shape the launch.', '#CustomerObsession'],
    ['rohan.verma@kudos.local', 'ananya.rao@kudos.local', 20, 'Amazing collaboration on the customer story.', '#Teamwork'],
    ['ananya.rao@kudos.local', 'vivaan.singh@kudos.local', 10, 'Thanks for acting quickly on the prospect feedback.', '#CustomerObsession'],
    ['vivaan.singh@kudos.local', 'isha.nair@kudos.local', 20, 'Excellent work closing the enterprise renewal.', '#Innovation'],
    ['isha.nair@kudos.local', 'aarav.mehta@kudos.local', 10, 'Thanks for making the sales demo environment reliable.', '#Teamwork'],
  ];

  const kudos = await Kudos.insertMany(kudosDefinitions.map(([senderEmail, receiverEmail, points, message, companyValue]) => ({
    sender: byEmail[senderEmail]._id,
    receiver: byEmail[receiverEmail]._id,
    points,
    message,
    companyValue,
  })));

  await Reaction.insertMany([
    { kudos: kudos[0]._id, user: byEmail['kabir.patel@kudos.local']._id, type: '👏' },
    { kudos: kudos[0]._id, user: byEmail['meera.iyer@kudos.local']._id, type: '+1' },
    { kudos: kudos[3]._id, user: byEmail['ananya.rao@kudos.local']._id, type: '🔥' },
    { kudos: kudos[6]._id, user: byEmail['aarav.mehta@kudos.local']._id, type: '👏' },
  ]);

  const balances = new Map(users.map((user) => [user._id.toString(), { givingAllowance: 100, earnedPoints: 0 }]));
  for (const kudosItem of kudos) {
    balances.get(kudosItem.sender.toString()).givingAllowance -= kudosItem.points;
    balances.get(kudosItem.receiver.toString()).earnedPoints += kudosItem.points;
  }
  await User.bulkWrite(users.map((user) => ({
    updateOne: {
      filter: { _id: user._id },
      update: { $set: balances.get(user._id.toString()) },
    },
  })));

  const { selected } = getMonthRange();
  const now = new Date();
  await MonthlyReset.create({
    month: selected,
    status: 'completed',
    usersReset: users.length,
    startedAt: now,
    completedAt: now,
    lockExpiresAt: now,
  });

  console.log(`Seeded ${users.length} users, ${kudos.length} kudos, and 4 reactions.`);
  console.log('Seed completed. Use the SEED_PASSWORD value from your local .env to sign in.');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
  });
