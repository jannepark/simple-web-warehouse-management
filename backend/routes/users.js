import express from 'express';
import {
  getUser,
  updateUser,
  createUser,
  updateUserPassword
} from '../controllers/users.js';
import tokenExtractor from '../middlewares/tokenExtractor.js';
import { login } from '../controllers/login.js';
import { logout } from '../controllers/logout.js';

const router = express.Router();

router.post('/login', login);
router.delete('/logout', tokenExtractor, logout);
router.post('/', createUser);
router.get('/user', tokenExtractor, getUser);
router.put('/', tokenExtractor, updateUser);
router.put('/password', tokenExtractor, updateUserPassword);

export default router;
