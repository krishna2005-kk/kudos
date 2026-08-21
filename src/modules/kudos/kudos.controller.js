const kudosService = require('./kudos.service');
const asyncHandler = require('../../shared/utils/asyncHandler');

const giveKudos = asyncHandler(async (req, res) => {
  const kudos = await kudosService.giveKudos(req.user._id, req.validated.body);
  res.status(201).json({ success: true, message: 'Kudos sent successfully', data: { kudos } });
});

const getFeed = asyncHandler(async (req, res) => {
  const data = await kudosService.getFeed(req.validated.query, req.user._id);
  res.status(200).json({ success: true, message: 'Kudos feed retrieved', data });
});

const getKudos = asyncHandler(async (req, res) => {
  const data = await kudosService.getKudosById(req.validated.params.id, req.user._id);
  res.status(200).json({ success: true, message: 'Kudos retrieved', data });
});

module.exports = { giveKudos, getFeed, getKudos };
