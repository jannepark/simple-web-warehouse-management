import { UnauthorizedError } from './requestErrors.js';
import jwt from 'jsonwebtoken';
 
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: err.errors.map(e => e.message) });
  }
  if (err instanceof jwt.JsonWebTokenError) {
    return next(new UnauthorizedError('Invalid token'));
  }
  if (err instanceof jwt.TokenExpiredError) {
    return next(new UnauthorizedError('Token expired'));
  }
  res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;

