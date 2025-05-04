
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SECRET } from '../util/config.js';
import { User, Session } from '../models/index.js';
import { BadRequestError, UnauthorizedError, ForbiddenError } from '../middlewares/requestErrors.js';


export const login = async (request, response, next) => {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      throw new BadRequestError('username and password required');
    }

    const user = await User.findOne({
      where: {
        username: username
      }
    });

    if (!user) {
      throw new UnauthorizedError('invalid username or password');
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!passwordCorrect) {
      throw new UnauthorizedError('invalid username or password');
    }

    if (user.disabled) {
      throw new ForbiddenError('account disabled');
    }

    const userForToken = {
      id: user.id,
      username: user.username
    };
    const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' });

    await Session.create({ token, userId: user.id });

    response.status(200).send({ token, username: user.username, name: user.name, id: user.id });
  } catch (error) {
    next(error);
  }
};