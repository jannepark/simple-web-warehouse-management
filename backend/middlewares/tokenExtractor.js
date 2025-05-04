import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config.js';
import { Session } from '../models/index.js';
import { UnauthorizedError } from './requestErrors.js';

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7);
      const decodedToken = jwt.verify(token, SECRET);
      req.decodedToken = { ...decodedToken, token };

      const session = await Session.findOne({ where: { token } });
      if (!session) {
        return next(new UnauthorizedError('Token invalid'));
      }
      const user = await session.getUser();
      if (!user || user.disabled) {
        throw new UnauthorizedError('No user found or account disabled');
      }
      req.user = user;
    //  eslint-disable-next-line no-unused-vars
    } catch (error) {
      return next(new UnauthorizedError('Token invalid'));
    }
  } else {
    return next(new UnauthorizedError('Token missing', { authorizationHeader: authorization || 'None' }));
  }
  next();
};

export default tokenExtractor;
