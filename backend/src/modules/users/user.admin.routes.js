const express = require('express');
const { protect, authorize } = require('../auth/auth.middleware');
const validate = require('../../shared/middleware/validate');
const { adminUpdateUserSchema, adminListUsersSchema, adjustUserPointsSchema } = require('./user.validation');
const userController = require('./user.controller');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/users', validate(adminListUsersSchema), userController.adminListUsers);
router.patch('/users/:id', validate(adminUpdateUserSchema), userController.adminUpdateUser);
router.post('/users/:id/points', validate(adjustUserPointsSchema), userController.addPoints);

module.exports = router;
