const express = require('express');
const userController = require('./user.controller');
const validate = require('../../shared/middleware/validate');
const { listUsersSchema, userIdSchema, updateProfileSchema } = require('./user.validation');
const { protect } = require('../auth/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/', validate(listUsersSchema), userController.listUsers);
router.get('/me', userController.getMe);
router.patch('/me', validate(updateProfileSchema), userController.updateMe);
router.get('/:id', validate(userIdSchema), userController.getUser);

module.exports = router;
