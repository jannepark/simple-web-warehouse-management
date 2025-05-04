
import { Session } from '../models/index.js';

export const logout = async (req, res, next) => {
  try {
    console.log('logging out user', req.user.username);
    await Session.destroy({ where: { token: req.decodedToken.token } });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

