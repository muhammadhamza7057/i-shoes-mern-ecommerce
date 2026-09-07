import { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { updateMeSchema, changePasswordSchema } from './users.validation.js';
import * as usersController from './users.controller.js';

const router = Router();

router.use(authenticate);

router.get('/me', asyncHandler(usersController.getMe));
router.patch('/me', validate(updateMeSchema), asyncHandler(usersController.updateMe));
router.patch('/password', validate(changePasswordSchema), asyncHandler(usersController.changePassword));

export default router;
