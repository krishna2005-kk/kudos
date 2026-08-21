process.env.NODE_ENV = 'test';

const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const config = require('../src/config/env');
const connectDatabase = require('../src/database/connectDatabase');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const Kudos = require('../src/modules/kudos/kudos.model');

before(async () => {
  config.validateEnv();
  if (!config.mongoUri.endsWith('/kudos_test')) {
    throw new Error('Tests may run only against the dedicated kudos_test database');
  }
  await connectDatabase();
  await mongoose.connection.dropDatabase();
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test('signup, protected profile, refresh rotation, and logout work together', async () => {
  const agent = request.agent(app);
  const signupResponse = await agent.post('/api/v1/auth/signup').send({
    name: 'Test Employee',
    email: 'employee@kudos.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    department: 'Engineering',
  });

  assert.equal(signupResponse.status, 201);
  assert.equal(signupResponse.body.success, true);
  assert.ok(signupResponse.body.data.accessToken);
  assert.equal(signupResponse.body.data.user.givingAllowance, undefined);

  const accessToken = signupResponse.body.data.accessToken;
  const profileResponse = await agent.get('/api/v1/users/me').set('Authorization', `Bearer ${accessToken}`);
  assert.equal(profileResponse.status, 200);
  assert.equal(profileResponse.body.data.user.email, 'employee@kudos.test');

  const updateResponse = await agent.patch('/api/v1/users/me').set('Authorization', `Bearer ${accessToken}`).send({
    name: 'Updated Employee',
    avatar: 'https://example.com/avatar.png',
    role: 'admin',
    givingAllowance: 9999,
  });
  assert.equal(updateResponse.status, 200);
  assert.equal(updateResponse.body.data.user.name, 'Updated Employee');
  assert.equal(updateResponse.body.data.user.role, 'employee');
  assert.equal(updateResponse.body.data.user.givingAllowance, undefined);

  const refreshResponse = await agent.post('/api/v1/auth/refresh-token');
  assert.equal(refreshResponse.status, 200);
  assert.ok(refreshResponse.body.data.accessToken);

  const logoutResponse = await agent.post('/api/v1/auth/logout');
  assert.equal(logoutResponse.status, 200);

  const rejectedRefreshResponse = await agent.post('/api/v1/auth/refresh-token');
  assert.equal(rejectedRefreshResponse.status, 401);
});

test('signup rejects a duplicate email and protected routes reject missing tokens', async () => {
  const duplicate = await request(app).post('/api/v1/auth/signup').send({
    name: 'Another Employee',
    email: 'employee@kudos.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    department: 'Design',
  });
  assert.equal(duplicate.status, 409);

  const protectedResponse = await request(app).get('/api/v1/kudos');
  assert.equal(protectedResponse.status, 401);
});

test('kudos point transfer succeeds on a replica set or fails without changing balances on standalone MongoDB', async () => {
  const senderSignup = await request(app).post('/api/v1/auth/signup').send({
    name: 'Kudos Sender',
    email: 'sender@kudos.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    department: 'Engineering',
  });
  const receiverSignup = await request(app).post('/api/v1/auth/signup').send({
    name: 'Kudos Receiver',
    email: 'receiver@kudos.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    department: 'Design',
  });

  assert.equal(senderSignup.status, 201);
  assert.equal(receiverSignup.status, 201);

  const senderId = senderSignup.body.data.user.id;
  const receiverId = receiverSignup.body.data.user.id;
  const response = await request(app)
    .post('/api/v1/kudos')
    .set('Authorization', `Bearer ${senderSignup.body.data.accessToken}`)
    .send({
      receiverId,
      points: 20,
      message: 'Thanks for helping with the release!',
      companyValue: '#Teamwork',
    });

  const [sender, receiver, kudosCount] = await Promise.all([
    User.findById(senderId).select('+givingAllowance'),
    User.findById(receiverId).select('+givingAllowance'),
    Kudos.countDocuments({ sender: senderId, receiver: receiverId }),
  ]);

  if (response.status === 503) {
    assert.equal(sender.givingAllowance, 100);
    assert.equal(receiver.earnedPoints, 0);
    assert.equal(kudosCount, 0);
    return;
  }

  assert.equal(response.status, 201);
  assert.equal(sender.givingAllowance, 80);
  assert.equal(receiver.earnedPoints, 20);
  assert.equal(kudosCount, 1);
});

test('only admins can update an employee role or department', async () => {
  const adminSignup = await request(app).post('/api/v1/auth/signup').send({
    name: 'Administrator',
    email: 'admin@kudos.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    department: 'Engineering',
  });
  const employeeSignup = await request(app).post('/api/v1/auth/signup').send({
    name: 'Managed Employee',
    email: 'managed@kudos.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    department: 'Marketing',
  });
  assert.equal(adminSignup.status, 201);
  assert.equal(employeeSignup.status, 201);

  const employeeId = employeeSignup.body.data.user.id;
  const forbidden = await request(app)
    .patch(`/api/v1/admin/users/${employeeId}`)
    .set('Authorization', `Bearer ${employeeSignup.body.data.accessToken}`)
    .send({ department: 'Sales' });
  assert.equal(forbidden.status, 403);

  await User.findByIdAndUpdate(adminSignup.body.data.user.id, { role: 'admin' });
  const updated = await request(app)
    .patch(`/api/v1/admin/users/${employeeId}`)
    .set('Authorization', `Bearer ${adminSignup.body.data.accessToken}`)
    .send({ department: 'Sales', role: 'admin', givingAllowance: 9999 });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.user.department, 'Sales');
  assert.equal(updated.body.data.user.role, 'admin');
  assert.equal(updated.body.data.user.givingAllowance, undefined);
});

test('reactions prevent duplicates and return an updated summary', async () => {
  const actorSignup = await request(app).post('/api/v1/auth/signup').send({
    name: 'Reaction Actor',
    email: 'reactor@kudos.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    department: 'Sales',
  });
  const receiverSignup = await request(app).post('/api/v1/auth/signup').send({
    name: 'Reaction Receiver',
    email: 'reaction-receiver@kudos.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    department: 'Design',
  });
  const kudos = await Kudos.create({
    sender: actorSignup.body.data.user.id,
    receiver: receiverSignup.body.data.user.id,
    points: 10,
    message: 'A kudos used to test reactions.',
    companyValue: '#Innovation',
  });
  const authorization = { Authorization: `Bearer ${actorSignup.body.data.accessToken}` };

  const added = await request(app).post(`/api/v1/kudos/${kudos.id}/reactions`).set(authorization).send({ type: '🔥' });
  assert.equal(added.status, 201);
  assert.equal(added.body.data.reactionSummary.counts['🔥'], 1);
  assert.deepEqual(added.body.data.reactionSummary.viewerReactions, ['🔥']);

  const duplicate = await request(app).post(`/api/v1/kudos/${kudos.id}/reactions`).set(authorization).send({ type: '🔥' });
  assert.equal(duplicate.status, 409);

  const removed = await request(app).delete(`/api/v1/kudos/${kudos.id}/reactions/🔥`).set(authorization);
  assert.equal(removed.status, 200);
  assert.equal(removed.body.data.reactionSummary.counts['🔥'], 0);
  assert.deepEqual(removed.body.data.reactionSummary.viewerReactions, []);
});

test('leaderboard is protected and admin analytics return aggregate data', async () => {
  const adminSignup = await request(app).post('/api/v1/auth/signup').send({
    name: 'Analytics Admin',
    email: 'analytics-admin@kudos.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    department: 'Engineering',
  });
  assert.equal(adminSignup.status, 201);

  const token = adminSignup.body.data.accessToken;
  const leaderboard = await request(app).get('/api/v1/leaderboard').set('Authorization', `Bearer ${token}`);
  assert.equal(leaderboard.status, 200);
  assert.ok(Array.isArray(leaderboard.body.data.entries));

  const forbiddenAnalytics = await request(app).get('/api/v1/analytics/overview').set('Authorization', `Bearer ${token}`);
  assert.equal(forbiddenAnalytics.status, 403);

  await User.findByIdAndUpdate(adminSignup.body.data.user.id, { role: 'admin' });
  const overview = await request(app).get('/api/v1/analytics/overview').set('Authorization', `Bearer ${token}`);
  const departments = await request(app).get('/api/v1/analytics/departments').set('Authorization', `Bearer ${token}`);
  const companyValues = await request(app).get('/api/v1/analytics/company-values').set('Authorization', `Bearer ${token}`);
  assert.equal(overview.status, 200);
  assert.equal(departments.status, 200);
  assert.equal(companyValues.status, 200);
  assert.ok(overview.body.data.totals.totalKudos > 0);
});
