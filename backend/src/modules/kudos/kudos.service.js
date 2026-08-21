const mongoose = require('mongoose');
const User = require('../users/user.model');
const kudosRepository = require('./kudos.repository');
const AppError = require('../../shared/errors/AppError');
const { getReactionSummaries } = require('../reactions/reaction.service');
const config = require('../../config/env');

function encodeCursor(kudos) {
  return Buffer.from(JSON.stringify({ createdAt: kudos.createdAt, id: kudos._id })).toString('base64url');
}

function decodeCursor(cursor) {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    if (!parsed.createdAt || !mongoose.isValidObjectId(parsed.id) || Number.isNaN(new Date(parsed.createdAt).getTime())) {
      throw new Error('Invalid cursor');
    }
    return { createdAt: new Date(parsed.createdAt), id: new mongoose.Types.ObjectId(parsed.id) };
  } catch {
    throw new AppError('Invalid pagination cursor', 400);
  }
}

function isTransactionUnsupportedError(error) {
  let current = error;
  for (let depth = 0; current && depth < 5; depth += 1) {
    if (current.code === 20 || /Transaction numbers are only allowed|does not support retryable writes/i.test(current.message || '')) {
      return true;
    }
    current = current.originalError;
  }
  return false;
}

async function giveKudosWithoutTransaction(senderId, input) {
  const sender = await User.findOneAndUpdate(
    { _id: senderId, givingAllowance: { $gte: input.points } },
    { $inc: { givingAllowance: -input.points } },
    { returnDocument: 'after' }
  );
  if (!sender) throw new AppError('Insufficient giving allowance', 400);

  const receiver = await User.findByIdAndUpdate(
    input.receiverId,
    { $inc: { earnedPoints: input.points } },
    { returnDocument: 'after' }
  );
  if (!receiver) {
    await User.findByIdAndUpdate(senderId, { $inc: { givingAllowance: input.points } });
    throw new AppError('Receiver not found', 404);
  }

  try {
    const kudos = await kudosRepository.create({ sender: senderId, receiver: input.receiverId, ...input });
    return kudosRepository.findById(kudos._id);
  } catch (error) {
    await Promise.all([
      User.findByIdAndUpdate(senderId, { $inc: { givingAllowance: input.points } }),
      User.findByIdAndUpdate(input.receiverId, { $inc: { earnedPoints: -input.points } }),
    ]);
    throw error;
  }
}

async function giveKudos(senderId, input) {
  if (senderId.toString() === input.receiverId) {
    throw new AppError('You cannot give kudos to yourself', 400);
  }

  const session = await mongoose.startSession();
  let kudos;
  try {
    await session.withTransaction(async () => {
      const sender = await User.findOneAndUpdate(
        { _id: senderId, givingAllowance: { $gte: input.points } },
        { $inc: { givingAllowance: -input.points } },
        { returnDocument: 'after', session }
      );
      if (!sender) throw new AppError('Insufficient giving allowance', 400);

      const receiver = await User.findByIdAndUpdate(
        input.receiverId,
        { $inc: { earnedPoints: input.points } },
        { returnDocument: 'after', session }
      );
      if (!receiver) throw new AppError('Receiver not found', 404);

      kudos = await kudosRepository.create({ sender: senderId, receiver: input.receiverId, ...input }, session);
    });
  } catch (error) {
    if (isTransactionUnsupportedError(error)) {
      if (config.allowStandaloneKudos) return giveKudosWithoutTransaction(senderId, input);
      throw new AppError('Kudos transactions require MongoDB to run as a replica set', 503);
    }
    throw error;
  } finally {
    await session.endSession();
  }

  return kudosRepository.findById(kudos._id);
}

async function getKudosById(kudosId, viewerId) {
  const kudos = await kudosRepository.findById(kudosId);
  if (!kudos) throw new AppError('Kudos not found', 404);
  const reactionSummary = (await getReactionSummaries([kudos._id], viewerId)).get(kudos._id.toString());
  return { kudos, reactionSummary };
}

async function getFeed(query, viewerId) {
  const filter = {};
  if (query.companyValue) filter.companyValue = query.companyValue;
  if (query.cursor) {
    const cursor = decodeCursor(query.cursor);
    filter.$or = [
      { createdAt: { $lt: cursor.createdAt } },
      { createdAt: cursor.createdAt, _id: { $lt: cursor.id } },
    ];
  }

  const results = await kudosRepository.findFeed(filter, query.limit + 1);
  const hasNextPage = results.length > query.limit;
  const items = hasNextPage ? results.slice(0, query.limit) : results;
  const lastItem = items.at(-1);
  const reactionSummaries = await getReactionSummaries(items.map((item) => item._id), viewerId);

  return {
    kudos: items.map((item) => ({ ...item, reactionSummary: reactionSummaries.get(item._id.toString()) })),
    pageInfo: { hasNextPage, nextCursor: hasNextPage && lastItem ? encodeCursor(lastItem) : null },
  };
}

module.exports = { giveKudos, getKudosById, getFeed };
