import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { authValidationRules, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate, authorize);

router.get('/', getUsers);
router.post('/', authValidationRules(), handleValidationErrors, createUser);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
