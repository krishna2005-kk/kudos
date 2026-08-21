const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config/env');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createAccessToken(userId) {
  return jwt.sign({ type: 'access' }, config.accessTokenSecret, {
    subject: userId.toString(),
    expiresIn: config.accessTokenExpiresIn,
  });
}

function createRefreshToken(userId, tokenId) {
  return jwt.sign({ type: 'refresh', tokenId }, config.refreshTokenSecret, {
    subject: userId.toString(),
    expiresIn: config.refreshTokenExpiresIn,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.accessTokenSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, config.refreshTokenSecret);
}

module.exports = {
  hashToken,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
