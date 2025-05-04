
import { User, Warehouse } from '../models/index.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Warehouse,
        as: 'warehouses',
        through: { attributes: [] } // hide the join table attributes
      }
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};


export const createUser = async (req, res, next) => {
  try {
    const { username, name, password, disabled } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password.length < 5) {
      return res.status(400).json({ error: 'Password must be at least 5 characters long' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      name,
      passwordHash,
      disabled: disabled || false
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      name: user.name,
      disabled: user.disabled
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user) {
      const { username, name} = req.body.user;
      const currentPassword = req.body.currentPassword;

      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required' });
      }

      const passwordCorrect = await bcrypt.compare(currentPassword, req.user.passwordHash);
      if (!passwordCorrect) {
        return res.status(401).json({ error: 'current password is incorrect' });
      }
      await req.user.update({
        username,
        name
      });
      res.status(200).json(req.user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword} = req.body;

    if (newPassword.length < 5) {
      return res.status(400).json({ error: 'New password must be at least 5 characters long' });
    }

    if (!currentPassword || !newPassword ) {
      return res.status(400).json({ error: 'Old password, new password, and confirm new password are required' });
    }

    const passwordCorrect = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordCorrect) {
      return res.status(401).json({ error: 'current password is incorrect' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await user.update({ passwordHash });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
}
