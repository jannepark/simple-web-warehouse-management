import express from 'express';
import { logout } from '../controllers/logout.js';
import tokenExtractor from '../middlewares/tokenExtractor.js';

const router = express.Router();

router.post('/', tokenExtractor, logout);

export default router;