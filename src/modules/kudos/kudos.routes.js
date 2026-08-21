const express = require('express');
const kudosController = require('./kudos.controller');
const { protect, authorize } = require('../auth/auth.middleware');
const validate = require('../../shared/middleware/validate');
const { giveKudosSchema, kudosIdSchema, feedSchema } = require('./kudos.validation');

const router = express.Router();

router.use(protect);
router.get('/', validate(feedSchema), kudosController.getFeed);
router.post('/', authorize('employee'), validate(giveKudosSchema), kudosController.giveKudos);
router.get('/:id', validate(kudosIdSchema), kudosController.getKudos);

module.exports = router;
