
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db.js';

class Session extends Model { }

Session.init({
  token: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    field: 'user_id',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'session',
});

export default Session;
